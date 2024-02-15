from django.urls import path
from .views import register_view
from .views import CustomLoginView
from .views import profile_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('profile/', profile_view, name='profile'),
]
