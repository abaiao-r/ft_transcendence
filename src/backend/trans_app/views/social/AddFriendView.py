from trans_app.models import UserSetting
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse

class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        friend_username = request.data.get('friend_username').strip()
        try:
            user = request.user
            user_settings = UserSetting.objects.get(user=user)
            # Case-insensitive search for the username
            friend = User.objects.get(username__iexact=friend_username)
            if friend == request.user:
                return JsonResponse({"error": "You cannot add yourself as a friend."}, status=400)
            if user_settings.friends.filter(user=friend).exists():
                return JsonResponse({"error": f"{friend_username} is already a friend."}, status=400)
            friend_setting = UserSetting.objects.get(user=friend)
            user_settings.friends.add(friend_setting)
            return JsonResponse({"message": f"{friend_username} added successfully as a friend."}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)