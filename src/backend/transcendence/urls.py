
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
from chat import views as chat_views
from api.views.LoginAPIView import *
from api.views.SignupAPIView import *
from api.views.SettingsAPIView import *
from api.views.OAuthLoginAPIView import *
from api.views.OAuthCallbackAPIView import *
from chat.views.AddFriendView import *
from chat.views.ApiOnlineFriends import *
from chat.views.ApiOnlineUsers import *
from chat.views.ApiChatMessages import *
from chat.views.ApiUnread import *


urlpatterns = [
    path('admin/', admin.site.urls),
    #path('', chat_views.index, name='index'),
    #path('<int:id>', chat_views.index, name='index'),
    path('login/', LoginAPIView.as_view(), name='login_view'),
    path('signup/', SignupAPIView.as_view(), name='signup_view'),
    path('settings/', SettingsAPIView.as_view(), name='settings_view'),
    path('oauth/login/', OAuthLoginAPIView.as_view(), name='oauth_login'),
    path('oauth/callback/', OAuthCallbackAPIView.as_view(), name='oauth_callback'),

    path('online-friends/', ApiOnlineFriends.as_view(), name='online-friends'),
    path('online-friends/<int:id>', ApiOnlineFriends.as_view(), name='online-friends'),
    path('online-users/', ApiOnlineUsers.as_view(), name='online-users'),
    path('online-users/<int:id>', ApiOnlineUsers.as_view(), name='online-users'),
    path('chat-messages/<int:id>', ApiChatMessages.as_view(), name='chat_messages'),
    path('unread/', ApiUnread.as_view(), name='api_unread'),
    path('add_friend/', AddFriendView.as_view(), name='add_friend'),
    
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    #path('list_friends/', api_views.list_friends, name='list_friends'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


