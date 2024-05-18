from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
import re
from django.utils.translation import gettext_lazy as _


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(style={'input_type': 'password'})
    type_of_2fa = serializers.ChoiceField(choices=['none', 'email', 'sms', 'google_authenticator'], default='none')
    phone = serializers.CharField(max_length=15, allow_blank=True, required=False)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already used.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already used.")
        return value

    def validate_password(self, value):
        pattern = r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                _("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
            )
        return value

    def validate(self, data):
        type_of_2fa = data.get('type_of_2fa')
        phone = data.get('phone')
        if type_of_2fa == 'sms' and not phone:
            raise serializers.ValidationError("Phone number is required for SMS 2FA.")
        return data
