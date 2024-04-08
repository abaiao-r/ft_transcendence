from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from trans_app.models import UserSetting
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import pyotp

class VerifyTwoFactorAPIView(APIView):
	def post(self, request):
		# Extract parameters from the request
		type_of_2fa = request.data.get('type_of_2fa')
		username = request.data.get('username')
		verification_code = request.data.get('verification_code')

		# Check if user exists
		if username is None or type_of_2fa is None or verification_code is None:
			return Response({'error': 'Invalid request'}, status=400)
		
		user_setting = UserSetting.objects.get(username=username)
		
		if user_setting.type_of_2fa == 'none':
			return Response({'error': '2FA is turned off for this user'}, status=400)

		if type_of_2fa == 'google_authenticator':
			# Implement verification logic for Google Authenticator
			user_id = User.objects.get(username=username).id
			verification_successful = self.verify_authenticator(user_id, verification_code)
		else:
			# Invalid or unsupported 2FA type
			verification_successful = False

		# Return response based on the outcome of 2FA verification
		if verification_successful:
			user = User.objects.get(username=username)
			login(request, user)
			user_setting.is_online = True
			user_setting.save()
			# Generate JWT token
			refresh = RefreshToken.for_user(user)
			token_data = {
				'refresh': str(refresh),
				'access': str(refresh.access_token)
			}
			response = Response({'message': 'Two-factor authentication verified successfully'})
			response.data.update(token_data)
			return response
		else:
			return Response({'error': 'Failed to verify two-factor authentication'}, status=400)

		
	def verify_authenticator(self, user_id, verification_code):
		# Retrieve user's secret key from the database
		user_setting = UserSetting.objects.get(user_id=user_id)
		secret_key = user_setting.google_authenticator_secret_key

		# Create a TOTP object with the secret key
		totp = pyotp.TOTP(secret_key)

		# Verify the provided verification code
		return totp.verify(verification_code)
