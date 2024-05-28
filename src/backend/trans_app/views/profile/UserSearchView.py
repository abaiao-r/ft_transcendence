from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from trans_app.models import UserSetting
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class UserSearchView(APIView):

	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def post(self, request, format=None):
		data = request.data
		query = data.get('query', None)
		if query is None:
			return Response({'message': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)

		matching_users = UserSetting.objects.filter(username__icontains=query)
		user_data = {}
		for user in matching_users:
			user_data[user.username] = {
				'username': user.username,
				'profile_image': user.profile_image.url,
				'name': user.name,
				'surname': user.surname,
				'is_online': user.is_online,
				'last_online': user.last_online,
			}
		return Response(user_data)