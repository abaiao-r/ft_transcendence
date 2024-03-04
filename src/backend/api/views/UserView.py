from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from chat.models import UserSetting
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin


class UserView(LoginRequiredMixin, APIView):
    def get(self, request):
        user = request.user
        user_setting = UserSetting.objects.get(user=user)
        user_data = {
            'username': user_setting.username,
            'profile_image': user_setting.profile_image.url,
            'elo': user_setting.elo,

        }
        print("User data: ")
        return JsonResponse(user_data)