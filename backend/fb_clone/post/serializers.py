from rest_framework import serializers
from post.models import Post,Comment
from user_management.serializers import ProfileSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    likes = ProfileSerializer(many=True)
    class Meta:
        model = Comment
        fields=['user','likes','content',"edited"]
class PostSerializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    likes = ProfileSerializer(many=True)
    comments = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id','user',"content","likes","comments","media_file","created_at"]

    def get_comments(self, obj):
        comments = Comment.objects.filter(post=obj)
        serializer = CommentSerializer(comments, many=True)

        return serializer.data

