from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
import requests
from chat.models import UserSetting
from django.contrib.auth.hashers import make_password

class LoginAPIView(APIView):
    renderer_classes = [JSONRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        
        if user is not None:
            user_setting = UserSetting.objects.get(user=user)
            if user.is_active:
                if user_setting.type_of_2fa != None:
                    return self.activate_2fa(user_setting.type_of_2fa, user.id)
                
                login(request, user)
                user_setting = UserSetting.objects.get(user=user)
                user_setting.is_online = True
                user_setting.save()

                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'User is not active'}, status=400)
        else:
            return Response({'error': 'Username or Password was wrong'}, status=400)
    
    def activate_2fa(self, type, user_id):
        activation_data = {
            'type_of_2fa': type,
            'user_id': user_id,
        }
        activation_url = '/2fa/activate/'
        activation_response = requests.post(activation_url, data=activation_data)

        return activation_response