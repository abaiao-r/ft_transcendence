from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken

def obtain_jwt_token(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

def refresh_jwt_token(request):
    if request.method == 'POST':
        refresh_token = request.POST.get('refresh')
        token = RefreshToken(refresh_token)
        if token.blacklist_after:
            return JsonResponse({'error': 'Token is blacklisted'}, status=401)
        return JsonResponse({'access': str(token.access_token)})