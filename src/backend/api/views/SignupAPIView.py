from django.contrib.auth.models import User
from chat.models import UserSetting
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import re

class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        type_of_2fa = request.data.get('type_of_2fa')
        phone = request.data.get('phone')
        error = ''

        print(request.data)
        print(email, username, password, type_of_2fa, phone)
        
        if not email or not username or not password:
            return Response({'error': 'All fields are required.'}, status=400)
        if not email_valid(email):
            return Response({'error': 'Invalid email.'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'This email is already used.'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'This username is already used.'}, status=400)
        if type_of_2fa and type_of_2fa not in ['none', 'email', 'sms', 'google_authenticator']:
            return Response({'error': 'Invalid type of 2FA.'}, status=400)
        if type_of_2fa == 'sms' and not phone:
            return Response({'error': 'Phone number is required for SMS 2FA.'}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user_setting = UserSetting.objects.create(user=user, username=username, type_of_2fa=type_of_2fa, phone=phone)
        login(request, user)
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
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(regex, email)): return True
    return False
