from requests import Response
from trans_app.models import UserSetting
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from django.utils import timezone

class ListFriendsView(APIView):
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
				friends_json[friend.id] = get_user_data(settings)
		else:
			try:
				friend = User.objects.get(id=id)
				settings = UserSetting.objects.get(user=friend)
				friends_json[friend.id] = get_user_data(settings)
			except User.DoesNotExist:
				return JsonResponse({"error": "User not found."}, status=404)

		print(friends_json)
		return JsonResponse(friends_json)
	
def get_user_data(user_settings):
    return  {
                'username': user_settings.username,
                'profile-image': user_settings.profile_image.url,
                'is-online': get_online_status(user_settings)
            }

def get_online_status(user_settings):
	if user_settings.last_online:
		print('User last online:', user_settings.last_online)
		threshold = timezone.now() - timezone.timedelta(minutes=5)
		if user_settings.last_online > threshold:
			print('User is online')
			return True
	# if user not authenticated
	print('User is offline')
	return False