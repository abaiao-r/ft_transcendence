from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

application = ProtocolTypeRouter({
    'websocket':AuthMiddlewareStack(
        URLRouter([
        ])
    )
})

