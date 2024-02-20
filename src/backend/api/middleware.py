from django.utils.timezone import now
from django.contrib.auth import get_user_model

class UpdateLastRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            # Update last_request for the authenticated user
            User = get_user_model()
            User.objects.filter(pk=request.user.pk).update(last_request=now())
        return response
