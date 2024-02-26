
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
from chat import views as chat_views
from api import views as api_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', chat_views.index, name='index'),
    path('<int:id>', chat_views.index, name='index'),
    path('login/', api_views.login_view, name='login_view'),
    path('oauth/login/', api_views.oauth_login, name='oauth_login'),
    path('oauth/callback/', api_views.oauth_callback, name='oauth_callback'),
    path('signup/', api_views.signup_view, name='signup_view'),
    path('settings/', api_views.settings_view, name='settings_view'),

    path('online-friends/', chat_views.ApiOnlineFriends.as_view(), name='online-friends'),
    path('online-friends/<int:id>', chat_views.ApiOnlineFriends.as_view(), name='online-friends'),
    path('online-users/', chat_views.ApiOnlineUsers.as_view(), name='online-users'),
    path('online-users/<int:id>', chat_views.ApiOnlineUsers.as_view(), name='online-users'),
    path('chat-messages/<int:id>', chat_views.ApiChatMessages.as_view(), name='chat_messages'),
    path('unread/', chat_views.ApiUnread.as_view(), name='api_unread'),
    path('add_friend/', chat_views.AddFriendView.as_view(), name='add_friend'),
    
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    #path('list_friends/', api_views.list_friends, name='list_friends'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


