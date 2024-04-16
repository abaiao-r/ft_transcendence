# middleware.py
from django.utils import timezone
from trans_app.models import UserSetting

class UpdateLastOnlineMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		if request.user.is_authenticated:
			user_setting = UserSetting.objects.get(user=request.user)
			user_setting.last_online = timezone.now()
			user_setting.save()
		response = self.get_response(request)
		return response