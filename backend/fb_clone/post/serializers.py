from rest_framework import serializers
from post.models import Post,Comment
from user_management.serializers import ProfileSerializer
from django.utils.timesince import timesince

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
    humanized_created_at = serializers.SerializerMethodField()
    is_image = serializers.SerializerMethodField()

    def get_is_image(self,obj):
        return obj.is_image()

    def get_humanized_created_at(self,obj):
        return timesince(obj.created_at)
    class Meta:
        model = Post
        fields = ['id','user',"content","likes","comments","media_file","humanized_created_at","is_image"]

    def get_comments(self, obj):
        comments = Comment.objects.filter(post=obj)
        serializer = CommentSerializer(comments, many=True)

        return serializer.data

