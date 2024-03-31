from django.contrib.auth.models import User
from chat.models import UserSetting
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout

class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not user:
            return Response({"error": "User not found"}, status=404)
        if not User.objects.filter(username=user.username).exists():
            return Response({"error": "User does not exist"}, status=404)
        if not user.is_active:
            return Response({"error": "User is already logged out"}, status=400)
        # Set user as offline
        user_setting = UserSetting.objects.get(user=user)
        user_setting.is_online = False
        user_setting.save()
        logout(request)
        
        # Revoke JWT token
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        return Response({"message": "Logout successful"})