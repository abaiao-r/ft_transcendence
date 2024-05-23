from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from trans_app.models import UserSetting
import pyotp
import qrcode
import base64
from io import BytesIO

class ActivateTwoFactorAPIView(APIView):
    def post(self, request):
        print("OLHA ENTRASTE AQUI DEPOIS DO SIGNUP CLICK?")
        print('activate data:', request.data)
        type_of_2fa = request.data.get('type_of_2fa')
        user_id = request.data.get('user_id')
        
        if user_id is None or type_of_2fa is None:
            return Response({'error': 'Invalid request'}, status=400)
        if not User.objects.filter(id=user_id).exists() or not UserSetting.objects.filter(user_id=user_id).exists():
            return Response({'error': 'User not found'}, status=400)
        
        user_setting = UserSetting.objects.get(user_id=user_id)
        if user_setting.type_of_2fa == 'none':
            return Response({'error': '2FA is turned off for this user'}, status=400)
        if type_of_2fa == 'google_authenticator':
            print('Activating Google Authenticator')
            #Check if the secret key already exists to prevent re-activation
            if user_setting.google_authenticator_secret_key:
                secret_key = user_setting.google_authenticator_secret_key
                qr_code = self.generate_qr_code(self.construct_otp_uri(user_setting, secret_key))
                return Response({'message': '2FA is already activated, use existing QR Code.', 'qr_code': qr_code})
            else:
                activation_successful, auth_data = self.activate_google_authenticator(user_id)
        else:
            activation_successful = False
        if activation_successful:
            response = Response({'message': 'Two-factor authentication activated successfully'})
            response.data.update(auth_data)
            return response
        else:
            return Response({'error': 'Failed to activate two-factor authentication'}, status=400)

    def generate_qr_code(self, data):
        qr = qrcode.make(data)
        buffered = BytesIO()
        qr.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode()
        return qr_base64

    def construct_otp_uri(self, user_setting, secret_key):
        username = User.objects.get(id=user_setting.user_id).username
        issuer = 'transcendence42'
        totp = pyotp.TOTP(secret_key)
        return totp.provisioning_uri(name=username, issuer_name=issuer)

    def activate_google_authenticator(self, user_id):
        user_setting = UserSetting.objects.get(user_id=user_id)
        secret_key = user_setting.google_authenticator_secret_key
        user_setting.save()
        qr_uri = self.construct_otp_uri(user_setting, secret_key)
        encoded_qr_code = self.generate_qr_code(qr_uri)
        print('Secret key:', secret_key)
        print('QR code:', encoded_qr_code)
        return True, {'secret_key': secret_key, 'qr_code': encoded_qr_code}
