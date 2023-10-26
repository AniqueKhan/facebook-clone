from post.views import PostView
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter(trailing_slash=False)
router.register('', PostView, basename='post')
urlpatterns = [
    path('user_posts/<int:pk>', PostView.as_view({'get': 'user_posts'}), name='user_posts'),
    path('delete_comment/<int:pk>', PostView.as_view({'delete': 'delete_comment'}), name='delete_comment'),
    path("",include(router.urls))
]