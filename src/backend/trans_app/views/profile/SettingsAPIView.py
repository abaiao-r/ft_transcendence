from django.contrib.auth.models import User
from trans_app.models import UserSetting
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError

class SettingsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.query_params.get('username')
        if not username:
            user = request.user
        else:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)

        settings = UserSetting.objects.get(user=user)
        data = {
            "username": settings.username,
            "profile_image": settings.profile_image.url if settings.profile_image else None,
        }
        return Response(data)

    @staticmethod
    def validate_image_file(file):
        valid_mime_types = ['image/jpeg', 'image/png', 'image/gif']
        file_mime_type = file.content_type
        if file_mime_type not in valid_mime_types:
            raise ValidationError('Unsupported file type. Please upload a JPEG, PNG, or GIF image.')

    def post(self, request):
        user = User.objects.get(username=request.user)
        settings = UserSetting.objects.get(user=user)

        avatar = request.FILES.get("avatar")
        username = request.data.get('username')
        name = request.data.get('name')
        surname = request.data.get('surname')

        print("image: ", avatar)

        try:
            if username:
                settings.username = username
                user.username = username
            if avatar:
                SettingsAPIView.validate_image_file(avatar)
                settings.profile_image.delete(save=True)
                settings.profile_image = avatar
            if name:
                settings.name = name
            if surname:
                settings.surname = surname
            user.save()
            settings.save()
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        return Response({"message": "Settings updated successfully"})