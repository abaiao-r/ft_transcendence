from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserSetting

class OTPVerificationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Retrieve OTP and any other required data from the request
        otp = request.data.get('otp')
        
        # Retrieve user data stored in the session during signup
        signup_data = request.session.get('signup_data')
        if not signup_data:
            return Response({'error': 'Signup data not found in session.'}, status=status.HTTP_400_BAD_REQUEST)
        
        email = signup_data.get('email')
        username = signup_data.get('username')
        password = signup_data.get('password')
        type_of_2fa = signup_data.get('type_of_2fa')
        phone = signup_data.get('phone')

        # Perform OTP verification
        # Assuming you have a function or service for OTP verification, e.g., verify_otp()
        if not verify_otp(otp):
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with account creation
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
        # Generate or refresh JWT token
        refresh = RefreshToken.for_user(user)
        # Return JWT tokens
        return Response({
            'message': 'Signup successful',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
