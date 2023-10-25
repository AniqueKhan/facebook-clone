from post.views import PostView
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter(trailing_slash=False)
router.register('', PostView, basename='post')
urlpatterns = [
    path('user_posts/<int:pk>/', PostView.as_view({'get': 'user_posts'}), name='user-posts'),
    path("",include(router.urls))
]