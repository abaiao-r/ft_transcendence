from rich.console import Console
console = Console(style='bold green')
import json
from django.shortcuts import render
from .models import Message, UserSetting, Thread
from .managers import ThreadManager
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist




@login_required
def api_online_users(request, id=0):
    users_json = {}
    
    # Retrieve the user profile
    user_profile = UserSetting.objects.get(user=request.user)
    
    if id != 0:
        # Fetch a specific friend's information (Ensure you have logic to validate this)
        friend_profile = user_profile.friends.get(id=id)
        user_settings = UserSetting.objects.get(user=friend_profile.user)
        users_json['user'] = get_dictionary(friend_profile.user, user_settings)
    else:
        # Fetch all friends of the current user
        for friend in user_profile.friends.all():
            user_settings = UserSetting.objects.get(user=friend.user)
            users_json[friend.user.id] = get_dictionary(friend.user, user_settings)

    return HttpResponse(
        json.dumps(users_json),
        content_type='application/javascript; charset=utf8'
    )


@login_required
def api_online_friends(request, id=0):
    friends_json = {}
    user = request.user
    user_settings = UserSetting.objects.get(user=user)
    friends = user_settings.friends.all()
    print("Friends: ", friends)

    for friend_email in friends:
        try:
            friend = User.objects.get(email=friend_email)
            user_settings = UserSetting.objects.get(user=friend)
            if user_settings.is_online:  # Assuming 'is_online' is the field that tracks online status
                friends_json[friend.id] = get_dictionary(friend, user_settings)
        except User.DoesNotExist:
            print(f"No user found with email: {friend_email}")

    return HttpResponse(
        json.dumps(friends_json),
        content_type = 'application/javascript; charset=utf8'
    )

def get_dictionary(user, user_settings):
    return  {
                'id': user.id,
                'username': user_settings.username,
                'profile-image': user_settings.profile_image.url,
                'is-online': user_settings.is_online
            }

@login_required
def api_chat_messages(request, id):
    messages_json = {}
    count = int(request.GET.get('count', 0))
    
    thread_name =  ThreadManager.get_pair('self', request.user.id, id)
    thread, created = Thread.objects.get_or_create(name=thread_name)
    messages = Message.objects.filter(thread=thread).order_by('-id')
    
    for i, message in enumerate(messages, start=1):
        messages_json[message.id] = {
            'sender': message.sender.id,
            'text': message.text,
            'timestamp': message.created_at.isoformat(),
            'isread': message.isread,
        }
        if i == count: break


    return HttpResponse(
        json.dumps(messages_json),
        content_type = 'application/javascript; charset=utf8'
    )

@login_required
def api_unread(request):
    messages_json = {}
    
    user = request.user
    threads = Thread.objects.filter(users=user)
    for i, thread in enumerate(threads):
        if(user == thread.users.first()): 
            sender = thread.users.last()
            unread = thread.unread_by_1
        else: 
            sender = thread.users.first()
            unread = thread.unread_by_2
        
        messages_json[i] = {
            'sender': sender.id,
            'count': unread,
        }

    return HttpResponse(
        json.dumps(messages_json),
        content_type = 'application/javascript; charset=utf8'
    )

@login_required
def index(request, id=0):
    user = User.objects.get(username=request.user)
    Usettings, created = UserSetting.objects.get_or_create(user=user)

    context = {
        "settings" : Usettings,
        'id' : id,
    }
    return render(request, 'index.html', context=context)
