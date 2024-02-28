import json
from chat.models import UserSetting
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ApiOnlineUsers(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id=0):
        users_json = {}
        
        # Retrieve the user profile
        user_profile = UserSetting.objects.get(user=request.user)
        
        if id != 0:
            # Fetch a specific friend's information (Ensure you have logic to validate this)
            friend_profile = user_profile.friends.get(id=id)
            user_settings = UserSetting.objects.get(user=friend_profile.user)
            users_json['user'] = get_user_data(user_settings)
        else:
            # Fetch all friends of the current user
            for friend in user_profile.friends.all():
                user_settings = UserSetting.objects.get(user=friend.user)
                users_json[friend.user.id] = get_user_data(user_settings)

        return HttpResponse(
            json.dumps(users_json),
            content_type='application/javascript; charset=utf8'
        )

def get_user_data(user_settings):
    return  {
                'username': user_settings.username,
                'profile-image': user_settings.profile_image.url,
                'is-online': user_settings.is_online
            }