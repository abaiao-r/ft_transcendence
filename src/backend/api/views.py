from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from chat.models import UserSetting
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from datetime import datetime as dt
from datetime import timedelta
from django.utils.timezone import now
from django.urls import reverse
from urllib.parse import quote
from django.conf import settings
import requests
from django.core.files.base import ContentFile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.http import HttpResponseRedirect
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
        UserSetting.objects.create(user=user, username=username)
        
        # Generate or refresh JWT token
        refresh = RefreshToken.for_user(user)

        # Return JWT tokens
        return Response({
            'message': 'Signup successful',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
        else:
            return Response({'error': 'Username or Password was wrong'}, status=400)

class SettingsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(username=request.user)
        settings = UserSetting.objects.get(user=user)
        data = {
            "username": settings.username,
            "profile_image": settings.profile_image.url if settings.profile_image else None,
        }
        return Response(data)

    def post(self, request):
        user = User.objects.get(username=request.user)
        settings = UserSetting.objects.get(user=user)

        avatar = request.FILES.get("avatar")
        username = request.data.get('username')

        if username:
            settings.username = username
        if avatar:
            settings.profile_image.delete(save=True)
            settings.profile_image = avatar
        settings.save()

        return Response({"message": "Settings updated successfully"})

def email_valid(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(regex, email)): return True
    return False


def save_oauth_user(user, username, email, image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        # Get or create the UserSetting instance for the user
        user_setting, created = UserSetting.objects.get_or_create(user=user)
        # Save the image to the profile_image attribute of the UserSetting instance
        user_setting.profile_image.save(f"user_{user.pk}_profile.jpg", ContentFile(response.content), save=True)
        # Save the username and email to the UserSetting instance
        user_setting.username = username
        user_setting.save()

class OAuthLoginAPIView(APIView):
    def get(self, request):
        base_url = "https://api.intra.42.fr/oauth/authorize"
        
        # Constructing the redirect URI
        redirect_uri = f"{request.scheme}://{request.get_host()}/oauth/callback/"
        print("REDIRECT URI: ", redirect_uri)
        encoded_redirect_uri = quote(redirect_uri, safe='')
        
        # Constructing the OAuth URL
        oauth_url = f"{base_url}?client_id={settings.OAUTH_CLIENT_ID}&redirect_uri={encoded_redirect_uri}&response_type=code"
        print("OAUTH URL: ", oauth_url)
        
        # Redirecting to the OAuth URL
        return HttpResponseRedirect(oauth_url)

class OAuthCallbackAPIView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        token_url = "https://api.intra.42.fr/oauth/token"
        redirect_uri = "https://localhost/oauth/callback"
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.OAUTH_CLIENT_ID,
            'client_secret': settings.OAUTH_CLIENT_SECRET,
            'code': code,
            'redirect_uri': redirect_uri,
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        token_response = requests.post(token_url, data=data, headers=headers)
        access_token = token_response.json().get('access_token')

        print("ACCESS TOKEN: ", access_token)

        # Use the access token to get user data
        user_data_response = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
        user_data = user_data_response.json()
        print(user_data)
        user_email = user_data['email']
        user_login = user_data['login']
        user_small_pfp = user_data['image']['versions']['small']

        user, created = User.objects.get_or_create(username=user_login)
        if created:
            save_oauth_user(user, user_login, user_email, user_small_pfp)
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        # Return a successful response with JWT token access and refresh
        return Response({
            'message': 'Remote authentication successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })

# JWT token endpoints
def obtain_jwt_token(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

def refresh_jwt_token(request):
    if request.method == 'POST':
        refresh_token = request.POST.get('refresh')
        token = RefreshToken(refresh_token)
        if token.blacklist_after:
            return JsonResponse({'error': 'Token is blacklisted'}, status=401)
        return JsonResponse({'access': str(token.access_token)})