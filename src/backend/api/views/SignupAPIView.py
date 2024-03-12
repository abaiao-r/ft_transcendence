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
        error = ''
        
        if not email_valid(email):
            error = "Wrong email address."
        if User.objects.filter(email=email).exists():
            error = 'This email is already used.'
        if User.objects.filter(username=username).exists():
            error = 'This username is already used.'
        if error:
            return Response({'error': error}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user_setting = UserSetting.objects.create(user=user, username=username)
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
