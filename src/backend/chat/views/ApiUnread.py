import json
from chat.models import Thread
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ApiUnread(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
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