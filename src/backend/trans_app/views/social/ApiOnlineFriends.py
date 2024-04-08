from trans_app.models import UserSetting
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse

class ApiOnlineFriends(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        friends_json = {}
        user = request.user
        user_settings = UserSetting.objects.get(user=user)
        friends = user_settings.friends.all()

        if id is None:
            for friend in friends:
                user = friend.user
                settings = UserSetting.objects.get(user=user)
                if settings.is_online:
                    friends_json[friend.id] = get_user_data(settings)
        else:
            try:
                friend = User.objects.get(id=id)
                settings = UserSetting.objects.get(user=friend)
                friends_json[friend.id] = get_user_data(settings)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)

        return JsonResponse(friends_json)

def get_user_data(user_settings):
    return  {
                'username': user_settings.username,
                'profile-image': user_settings.profile_image.url,
                'is-online': user_settings.is_online
            }