from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from chat.models import UserSetting
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import pyotp

class VerifyTwoFactorAPIView(APIView):
	def post(self, request):
		# Extract parameters from the request
		type_of_2fa = request.data.get('type_of_2fa')
		user_id = request.data.get('user_id')
		verification_code = request.data.get('verification_code')

		# Check if user exists
		if user_id is None or type_of_2fa is None:
			return Response({'error': 'Invalid request'}, status=400)
		
		if not User.objects.filter(id=user_id).exists():
			return Response({'error': 'User not found'}, status=400)
		
		user_setting = UserSetting.objects.get(user_id=user_id)
		
		if user_setting.type_of_2fa == 'none':
			return Response({'error': '2FA is turned off for this user'}, status=400)

		if type_of_2fa == 'google_authenticator':
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

		
	def verify_authenticator(self, user_id, verification_code):
		# Retrieve user's secret key from the database
		user_setting = UserSetting.objects.get(user_id=user_id)
		secret_key = user_setting.google_authenticator_secret_key

		# Create a TOTP object with the secret key
		totp = pyotp.TOTP(secret_key)

		# Verify the provided verification code
		return totp.verify(verification_code)
