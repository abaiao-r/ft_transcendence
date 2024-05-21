from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from trans_app.models import UserSetting
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp

class VerifyTwoFactorAPIView(APIView):
    def post(self, request):
        temp_secret_key = request.session.get('temp_secret_key')
        signup_data = request.session.get('signup_data')
        type_of_2fa = request.data.get('type_of_2fa')
        username = request.data.get('username')
        verification_code = request.data.get('verification_code')
        if not all([type_of_2fa, username, verification_code]):
            return Response({'error': 'Invalid request'}, status=400)
        try:
            user_setting = UserSetting.objects.get(username=username)
        except UserSetting.DoesNotExist:
            return Response({'error': 'User settings not found'}, status=404)
        if user_setting.type_of_2fa == 'none':
            return Response({'error': '2FA is turned off for this user'}, status=400)
        if type_of_2fa == 'google_authenticator':
            user = User.objects.get(username=username)
            if self.verify_authenticator(user_setting, verification_code):
                login(request, user)
                refresh = RefreshToken.for_user(user)
                token_data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
                response = Response({'message': 'Two-factor authentication verified successfully'})
                response.data.update(token_data)
                return response
            else:
                # Provide more detailed feedback on failure
                return Response({'error': 'Verification failed. Check your app and try again.'}, status=401)

    def verify_authenticator(self, user_setting, verification_code):
        secret_key = user_setting.google_authenticator_secret_key
        totp = pyotp.TOTP(secret_key)
        # Allow a small window to accommodate potential time drift
        return totp.verify(verification_code, valid_window=1)
