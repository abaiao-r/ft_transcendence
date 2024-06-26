from django.contrib.auth import login
from django.contrib.auth.models import User
from trans_app.models import UserSetting
from trans_app.models import UserStats
from django.conf import settings
import requests
from django.core.files.base import ContentFile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from urllib.parse import urlencode
from django.shortcuts import redirect

class OAuthCallbackAPIView(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        code = request.GET.get('code')
        token_url = "https://api.intra.42.fr/oauth/token"
        redirect_uri = "https://localhost:8443/oauth/callback"
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

        if not access_token:
            base_frontend_url = "https://localhost:8443/#Login"
            query_params = urlencode({
                'error': '42 API is not responding. Please try again later.',
            })
            redirect_url = f"{base_frontend_url}?{query_params}"
            return redirect(redirect_url)

        # Use the access token to get user data
        user_data_response = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
        user_data = user_data_response.json()
        print("USER DATA: ", user_data)
        user_email = user_data['email']
        user_login = user_data['login']
        user_small_pfp = user_data['image']['versions']['small']
        user_first_name = user_data['first_name']
        user_last_name = user_data['last_name']

        # Check if user already exists
        if userExistsAndNotOauth(user_login):
        # return error and redirect to login page without query parameters
            base_frontend_url = "https://localhost:8443/#Login"
            query_params = urlencode({
                'error': 'User already exists',
            })
            redirect_url = f"{base_frontend_url}?{query_params}"
            return redirect(redirect_url)

        user, created = User.objects.get_or_create(username=user_login)
        if created:
            save_oauth_user(user, user_login, user_email, user_small_pfp, user_first_name, user_last_name)
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        base_frontend_url = "https://localhost:8443/"
        query_params = urlencode({
            'message': 'Remote authentication successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })
        redirect_url = f"{base_frontend_url}?{query_params}"
        return redirect(redirect_url)
    
def save_oauth_user(user, username, email, image_url, first_name, last_name):
    response = requests.get(image_url)
    if response.status_code == 200:
        # Get or create the UserSetting instance for the user
        user_setting, created = UserSetting.objects.get_or_create(user=user)
        # Save the image to the profile_image attribute of the UserSetting instance
        user_setting.profile_image.save(f"user_{user.pk}_profile.jpg", ContentFile(response.content), save=True)
        # Save the username and email to the UserSetting instance
        user_setting.username = username
        user_setting.name = first_name
        user_setting.surname = last_name
        user_setting.isOuth = True
        user_setting.save()
        user_stats = UserStats.objects.create(user=user)
        user_stats.save()

def userExistsAndNotOauth(username):
    return User.objects.filter(username=username).exists() and UserSetting.objects.filter(username=username).exists() and UserSetting.objects.filter(username=username).first().isOuth == False