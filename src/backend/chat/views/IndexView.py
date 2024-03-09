from rich.console import Console
console = Console(style='bold green')
import json
from django.shortcuts import render
from chat.models import Message, UserSetting, Thread
from chat.managers import ThreadManager
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse

@login_required
def index(request, id=0):
    user = User.objects.get(username=request.user)
    Usettings, created = UserSetting.objects.get_or_create(user=user)

    context = {
        "settings" : Usettings,
        'id' : id,
    }
    return render(request, 'index.html', context=context)