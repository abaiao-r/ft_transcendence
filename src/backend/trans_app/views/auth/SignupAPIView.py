from django.contrib.auth.models import User
from trans_app.models import UserSetting
from django.contrib.auth import login, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.password_validation import validate_password
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
            return Response({'error': str(e)}, status=400)

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
        user.save()
        user_setting = UserSetting.objects.create(user=user, username=username, type_of_2fa=type_of_2fa, phone=phone)
        user_setting.save()
        authenticate(username=username, password=password)
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
