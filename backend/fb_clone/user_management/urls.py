from django.urls import path,include
from rest_framework.routers import DefaultRouter
from user_management.views import (
    RegisterView,LoginView,FriendRequestView,ProfileView
)
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter(trailing_slash=False)
router.register('friend_requests', FriendRequestView, basename='friend_requests')
router.register("profile",ProfileView,basename="profile")
urlpatterns = [
    path("register",RegisterView.as_view(),name='register'),
    path("login",LoginView.as_view(),name='login'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path("",include(router.urls))
]