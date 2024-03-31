from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
import requests
from chat.models import UserSetting
from django.contrib.auth.models import User

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        print('Login request received')
        print('Username:', username)
        print('Password:', password)

        if not username or not password:
            print('Please provide both username and password')
            return Response({'error': 'Please provide both username and password'}, status=400)
        
        if not User.objects.filter(username=username).exists() or \
            not UserSetting.objects.filter(username=username).exists():
            print('User does not exist')
            return Response({'error': 'User does not exist'}, status=401)

        """ if not UserSetting.objects.filter(username=username, is_online=False).exists():
            print('User is already online')
            return Response({'error': 'User is already online'}, status=401) """
        
        user = authenticate(username=username, password=password)

        if user is not None:
            user_setting = UserSetting.objects.get(user=user)
            if user.is_active:
                if user_setting.type_of_2fa != None:
                    print('2FA is activated')
                    return self.activate_2fa(user_setting.type_of_2fa, user.id)
                
                login(request, user)
                user_setting = UserSetting.objects.get(user=user)
                user_setting.is_online = True
                user_setting.save()

                refresh = RefreshToken.for_user(user)
                print('Login successful: ', refresh, refresh.access_token)
                return Response({
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'User is not active'}, status=400)
        else:
            print('Username or Password was wrong')
            return Response({'error': 'Username or Password was wrong'}, status=401)
    
    def activate_2fa(self, type, user_id):
        activation_data = {
            'type_of_2fa': type,
            'user_id': user_id,
        }
        activation_url = '/2fa/activate/'
        activation_response = requests.post(activation_url, data=activation_data)

        return activation_response