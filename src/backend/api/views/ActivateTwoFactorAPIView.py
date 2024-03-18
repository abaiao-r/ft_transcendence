from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from chat.models import UserSetting
from django.conf import settings
import pyotp
import qrcode
import base64
import qrcode.image.svg
from io import BytesIO

class ActivateTwoFactorAPIView(APIView):
	def post(self, request):
		# Extract parameters from the request
		type_of_2fa = request.data.get('type_of_2fa')
		user_id = request.data.get('user_id')
		
		# Check if user exists
		if user_id is None or type_of_2fa is None:
			return Response({'error': 'Invalid request'}, status=400)
		
		if not User.objects.filter(id=user_id).exists() \
			or not UserSetting.objects.filter(user_id=user_id).exists():
			return Response({'error': 'User not found'}, status=400)

		user_setting = UserSetting.objects.get(user_id=user_id)
		
		if user_setting.type_of_2fa == 'none':
			return Response({'error': '2FA is turned off for this user'}, status=400)
		
		if type_of_2fa == 'google_authenticator':
			activation_successful, auth_data = self.activate_google_authenticator(user_id)

		else:
			# Invalid or unsupported 2FA type
			activation_successful = False

		# Return response based on the outcome of 2FA activation
		if activation_successful:
			response = Response({'message': 'Two-factor authentication activated successfully'})
			response.data.update(auth_data)
			return response
		else:
			return Response({'error': 'Failed to activate two-factor authentication'}, status=400)

	# Function to generate QR code and encode it as base64
	def generate_qr_code(self, data):
		qr = qrcode.make(data)
		buffered = BytesIO()
		qr.save(buffered, format="PNG")
		qr_base64 = base64.b64encode(buffered.getvalue()).decode()
		return qr_base64

	def activate_google_authenticator(self, user_id):
		# Generate a secret key for the user
		secret_key = pyotp.random_base32()

		print("SECRET KEY: ", secret_key)

		# Save the secret key in the database
		user_setting = UserSetting.objects.get(user_id=user_id)
		user_setting.google_authenticator_secret_key = secret_key
		user_setting.save()

		# Construct the OTP URL
		username = User.objects.get(id=user_id).username
		issuer = 'transcendence42'
		
		totp = pyotp.TOTP(secret_key)
		qr_uri = totp.provisioning_uri(
			name=username,
			issuer_name=issuer
		)

		image_factory = qrcode.image.svg.SvgPathImage
		qr_code_image = qrcode.make(
			qr_uri,
			image_factory=image_factory
		)

		encoded_qr_code = qr_code_image.to_string().decode('utf_8')

		return True, {'secret_key': secret_key, 'qr_code': encoded_qr_code}
