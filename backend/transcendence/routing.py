from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from chat.consumers import WebConsumer

application = ProtocolTypeRouter({
    'websocket':AuthMiddlewareStack(
        URLRouter([
            path('wss/<str:id>', WebConsumer.as_asgi()),
            path('wss/', WebConsumer.as_asgi()),
            path('wss/login/', WebConsumer.as_asgi()),
            path('wss/logout/', WebConsumer.as_asgi()),
            path('wss/signup/', WebConsumer.as_asgi()),
            path('wss/settings/', WebConsumer.as_asgi()),
        ])
    )
})

