import pyotp
import qrcode
from io import BytesIO
from django.http import HttpResponse
from django.contrib.auth.models import User
from trans_app.models import UserSetting
from django.contrib.auth import login, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re

class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        type_of_2fa = request.data.get('type_of_2fa')
        phone = request.data.get('phone')

        print(request.data)
        print(email, username, password, type_of_2fa, phone)
        
        if not email or not username or not password:
            return Response({'error': 'All fields are required.'}, status=400)
        
        try:
            validate_password(password)
        except ValidationError as e:
            error = """
Your password must meet the following requirements:
- At least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one digit
- Contain at least one special character
"""
            return Response({'error': error}, status=400)

        email_error = email_valid(email)
        if email_error:
            return Response({'error': email_error}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'This email is already used.'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'This username is already used.'}, status=400)
        if type_of_2fa and type_of_2fa not in ['none', 'email', 'sms', 'google_authenticator']:
            return Response({'error': 'Invalid type of 2FA.'}, status=400)
        if type_of_2fa == 'sms' and not phone:
            return Response({'error': 'Phone number is required for SMS 2FA.'}, status=400)

        print("ainda nao deste signup certo?")

		# Check if 2FA is enabled
        if type_of_2fa:
            # Here you should return the URL where the user should be redirected for OTP verification
            # For demonstration purposes, let's assume the URL is '/verify-otp/'
            # Also, store the user data in the session to use it after OTP verification
            secret_key = generate_secret_key()
			#temp
            user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        	)
        	# Store secret key temporarily (e.g., in session)
            request.session['temp_secret_key'] = secret_key
            request.session['signup_data'] = {
                'email': email,
                'username': username,
                'password': password,
                'type_of_2fa': type_of_2fa,
                'phone': phone
            }
            user_setting.is_online = False
            qr_code = generate_qr_code(secret_key, username)
            refresh = RefreshToken.for_user(user)
            # Generate QR code for Google Authenticator
            # Return QR code along with other response data
            return Response({
                'message': 'Signup successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.save()
        user_setting = UserSetting.objects.create(user=user, username=username, type_of_2fa=type_of_2fa, phone=phone)
        user_setting.save()
        authenticate(username=username, password=password)
        login(request, user)
        if type_of_2fa == "google_authenticator":
            user_setting.is_online = False
        else:
            user_setting.is_online = True
        # Generate or refresh JWT token
        refresh = RefreshToken.for_user(user)
        # Return JWT tokens
        return Response({
            'message': 'Signup successful',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

def email_valid(email):
    try:
        validate_email(email)
        return None
    except ValidationError as e:
        return str(e)

def generate_qr_code(secret, username):
    otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=username, issuer_name="YourAppName")
    img = qrcode.make(otp_uri)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()

def verify_otp(secret, otp):
    totp = pyotp.TOTP(secret)
    return totp.verify(otp)

def generate_secret_key():
    return pyotp.random_base32()