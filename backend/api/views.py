from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from chat.models import UserSetting
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from datetime import datetime as dt
from datetime import timedelta
from django.utils.timezone import now

import re



def signup_view(request):
    logout(request)

    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        error = ''
        
        if not email_valid(email):
            error = "Wrong email address."
        try:
            if User.objects.get(username=email) is not None:
                error = 'This email is already used.'
        except: pass

        if error:  return render(request, "signup.html", context={'error': error})

        user = User.objects.create_user(
            username = email, 
            password = password,
        )
        userset = UserSetting.objects.create(user=user, username=username)
        
        login(request, user)
        return redirect('/')


    return render(request, 'signup.html')

def login_view(request):
    logout(request)
    context = {}


    if request.POST:
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(username=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('/')
        else:
            context = {
            "error": 'Email or Password was wrong.',
            }    
        
    return render(request, 'login.html',context)

@login_required
def settings_view(request):
    user = User.objects.get(username=request.user)
    Usettings = UserSetting.objects.get(user=user)  

    if request.method == 'POST':
        try:    avatar = request.FILES["avatar"]
        except: avatar = None
        username = request.POST['username']

        Usettings.username = username
        if(avatar != None):
            Usettings.profile_image.delete(save=True)
            Usettings.profile_image = avatar
        Usettings.save()

    context = {
        "settings" : Usettings,
        'user' : user,
    }
    return render(request, 'settings.html', context=context)

def email_valid(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(regex, email)): return True
    return False

@require_POST
@login_required
def add_friend(request):
    friend_username = request.POST.get('friend_username').strip()
    User = get_user_model()
    print(User.objects.all())
    try:
        # Case-insensitive search for the username
        print(friend_username)
        friend = User.objects.get(username__iexact=friend_username)
        print(friend)

        if friend == request.user:
            return JsonResponse({"error": "You cannot add yourself as a friend."}, status=400)
        user_setting = UserSetting.objects.get(user=request.user)
        friend_setting = UserSetting.objects.get(user=friend)
        user_setting.friends.add(friend_setting)
        return JsonResponse({"message": f"{friend_username} added successfully as a friend."}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
@login_required
def list_friends(request):
    friends = request.user.friends.all()
    friends_list = []
    for friend in friends:
        is_online = (now() - friend.last_request) < timedelta(minutes=5)
        friends_list.append({
            'username': friend.username,
            'profile_pic': request.build_absolute_uri(friend.profile_pic.url),
            'is_online': is_online,
            'last_login': friend.last_login.strftime('%Y-%m-%d %H:%M:%S'),
            'is_oauth': friend.is_oauth,
        })
    return JsonResponse(friends_list, safe=False)