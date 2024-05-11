from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import login, authenticate
from trans_app.models import UserSetting, UserStats
from rest_framework_simplejwt.tokens import RefreshToken
from trans_app.validation.SignupSerializer import *
from trans_app.validation.ValidationUtils import *

class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            user.save()
            user_setting = UserSetting.objects.create(
                user=user,
                username=data['username'],
                type_of_2fa=data['type_of_2fa'],
                phone=data.get('phone', '')
            )
            user_setting.save()
            user_stats = UserStats.objects.create(user=user)
            user_stats.save()
            authenticate(username=data['username'], password=data['password'])
            login(request, user)
            user_setting.is_online = True

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Signup successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            errors = ValidationUtils.getErrors(serializer)
            return Response({'error': errors}, status=400)
