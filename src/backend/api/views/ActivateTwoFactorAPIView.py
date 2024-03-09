from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from chat.models import UserSetting
import smtplib
import ssl

class ActivateTwoFactorAPIView(APIView):
	def post(self, request):
		# Extract parameters from the request
		type_of_2fa = request.data.get('type_of_2fa')
		user_id = request.data.get('user_id')
		
		#check if user exists
		if user_id is None or type_of_2fa is None:
			return Response({'error': 'Invalid request'}, status=400)
		
		if not User.objects.filter(id=user_id).exists():
			return Response({'error': 'User not found'}, status=400)

		user_setting = UserSetting.objects.get(user_id=user_id)
		
		if user_setting.type_of_2fa == 'none':
			return Response({'error': '2FA is turned off for this user'}, status=400)
		
		if type_of_2fa == 'email':
			email = User.objects.get(id=user_id).email
			activation_successful = self.activate_email(email)

		elif type_of_2fa == 'sms':
			sms = UserSetting.objects.get(user_id=user_id).phone
			activation_successful = self.activate_sms(sms)

		elif type_of_2fa == 'google_authenticator':
			activation_successful = self.activate_google_authenticator(user_id)

		else:
			# Invalid or unsupported 2FA type
			activation_successful = False

		# Return response based on the outcome of 2FA activation
		if activation_successful:
			return Response({'message': 'Two-factor authentication activated successfully'})
		else:
			return Response({'error': 'Failed to activate two-factor authentication'}, status=400)

	def activate_email(self, email):
		# Generate a verification code (you can use a library like random or secrets)
		verification_code = self.generate_verification_code()

		# Save the verification code in the cache (associate it with the user's email)
		user_id = User.objects.get(email=email).id
		if user_id is None:
			return False
		cache_key = f'verification_code:{user_id}'
		cache.set(cache_key, verification_code, timeout=300)  # Set a timeout for the verification code (e.g., 5 minutes)

		# Send the verification code to the user's email
		#subject = 'Two-Factor Authentication Verification Code'
		message = f'Your verification code is: {verification_code}'
		from_email = settings.EMAIL_HOST_USER
		recipient_list = [email]

		context = None

		server = smtplib.SMTP_SSL('smtp.gmail.com', port=settings.EMAIL_PORT, context=context) 
		server.set_debuglevel(1)
		server.login(from_email, settings.EMAIL_HOST_PASSWORD)
		server.sendmail(from_email, recipient_list, message)

		server.quit()

		return True

	
	def activate_sms(self, phone):
		return True #TODO
	
	def activate_google_authenticator(self, user_id):
		return True #TODO

	def generate_verification_code(self):
		return '123456'  #TODO