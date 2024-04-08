from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
import requests
from trans_app.models import UserSetting
from django.contrib.auth.models import User
import pyotp
import qrcode
import base64
import qrcode.image.svg
from io import BytesIO


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        print('Login request received')
        print('Username:', username)
        print('Password:', password)

        if not username or not password:
            print('Please provide both username and password')
            return Response({'error': 'Please provide both username and password'}, status=400)
        
        if not User.objects.filter(username=username).exists() or \
            not UserSetting.objects.filter(username=username).exists():
            print('User does not exist')
            return Response({'error': 'User does not exist'}, status=401)
        
        user = authenticate(username=username, password=password)

        if user is not None:
            user_setting = UserSetting.objects.get(user=user)
            if user.is_active:
                if user_setting.type_of_2fa != None:
                    print('2FA is activated')
                    return self.activate_2fa(user.id, user_setting.type_of_2fa)
                
                login(request, user)
                user_setting = UserSetting.objects.get(user=user)
                user_setting.is_online = True
                user_setting.save()

                # Generate JWT token
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'User is not active'}, status=400)
        else:
            print('Username or Password was wrong')
            return Response({'error': 'Username or Password was wrong'}, status=401)
    
    def activate_2fa(self, user_id, type_of_2fa):
        if user_id is None or type_of_2fa is None:
            return {'error': 'Invalid request'}

        if not User.objects.filter(id=user_id).exists() or \
        not UserSetting.objects.filter(user_id=user_id).exists():
            return {'error': 'User not found'}

        user_setting = UserSetting.objects.get(user_id=user_id)
        
        if user_setting.type_of_2fa == 'none':
            return {'error': '2FA is turned off for this user'}
        
        if type_of_2fa == 'google_authenticator':
            auth_data = self.activate_google_authenticator(user_id)
            response = Response({'message': 'Two-factor authentication activated successfully'})
            
            response.data.update(auth_data)
            return response

        return {'error': 'Invalid or unsupported 2FA type'}
        
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

        print('Secret key:', secret_key)
        print('QR code:', encoded_qr_code)
        return {'secret_key': secret_key, 'qr_code': encoded_qr_code}