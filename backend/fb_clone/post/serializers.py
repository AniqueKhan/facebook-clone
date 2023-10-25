from rest_framework import serializers
from post.models import Post
from user_management.serializers import ProfileSerializer
class PostSerializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    class Meta:
        model = Post
        fields = ['id','user',"content"]