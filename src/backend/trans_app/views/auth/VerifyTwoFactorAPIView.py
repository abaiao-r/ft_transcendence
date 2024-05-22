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
        if temp_secret_key:
            # Access individual fields in signup_data
            email = signup_data.get('email')
            username = signup_data.get('username')
            password = signup_data.get('password')
            type_of_2fa = signup_data.get('type_of_2fa')
            phone = signup_data.get('phone')
            if self.verify_2(temp_secret_key, verification_code):
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
                refresh = RefreshToken.for_user(user)
                token_data = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token)
                    }
                response = Response({'message': 'Two-factor authentication verified successfully'})
                response.data.update(token_data)
                return response
        else :
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
    
    def verify_2(self, secret_key, veri_code):
        totp = pyotp.TOTP(secret_key)
        return totp.verify(veri_code, valid_window=1)