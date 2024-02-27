from django.contrib.auth.models import User
from chat.models import UserSetting
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

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