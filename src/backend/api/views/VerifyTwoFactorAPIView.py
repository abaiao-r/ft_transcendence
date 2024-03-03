from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class VerifyTwoFactorAPIView(APIView):
	def post(self, request):
		# Extract parameters from the request
		type_of_2fa = request.data.get('type_of_2fa')
		user_id = request.data.get('user_id')
		verification_code = request.data.get('verification_code')

		if type_of_2fa == 'email':
			# Implement verification logic for email-based 2FA
			verification_successful = self.verify_code(user_id, verification_code)
		elif type_of_2fa == 'sms':
			# Implement verification logic for SMS-based 2FA
			verification_successful = self.verify_code(user_id, verification_code)
		elif type_of_2fa == 'google_authenticator':
			# Implement verification logic for Google Authenticator
			verification_successful = self.verify_authenticator(user_id, verification_code)
		else:
			# Invalid or unsupported 2FA type
			verification_successful = False

		# Return response based on the outcome of 2FA verification
		if verification_successful:
			return Response({'message': 'Two-factor authentication verified successfully'})
		else:
			return Response({'error': 'Failed to verify two-factor authentication'}, status=400)

	def verify_code(self, user_id, verification_code):
		user = User.objects.get(id=user_id)
		cache_key = f'verification_code:{user_id}'
		
		if verification_code == cache.get(cache_key):
			refresh = RefreshToken.for_user(user)
			return Response({
				'message': 'Login successful',
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			})
		
	def verify_authenticator(self, user_id, verification_code):
		pass #TODO
