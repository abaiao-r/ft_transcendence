import json
from chat.models import UserSetting
from chat.models import Message, Thread
from chat.managers import ThreadManager
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ApiChatMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
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