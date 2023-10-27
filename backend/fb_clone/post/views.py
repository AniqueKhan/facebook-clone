from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from post.serializers import PostSerializer
from rest_framework.response import Response
from rest_framework import status
from user_management.models import User
from post.models import Post,Comment
from rest_framework.decorators import action
from datetime import datetime

class PostView(ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names=['get','delete','patch','post']
    serializer_class = PostSerializer

    def list(self,request):
        # Feed posts
        current_user = request.user
        feed_users = User.objects.filter(pk=current_user.pk) | current_user.friends.all()
        posts = Post.objects.filter(user__in=feed_users,privacy__in=['public', 'friends'])
        serializer = self.serializer_class(posts,many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    
    def retrieve(self,request,pk=None):
        post = self.queryset.filter(pk=pk).first()
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(post,many=False)
        return Response(serializer.data,status.HTTP_200_OK) 
    
    def update(self, request):
        return Response({"error_message":"Update method disabled"})
    
    def partial_update(self, request,pk):
        post = self.queryset.filter(pk=pk).first()
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)
        if post.user != request.user:
            return Response({"error_message":"You do not have rights to delete this post."},status.HTTP_401_UNAUTHORIZED)

        content = request.data.get("content")
        media_file = request.data.get("media_file")
        if not content and not media_file:
            return Response({"error_message":"You need to provide either content or media file to edit the post"},status.HTTP_400_BAD_REQUEST)
        if content:
            post.content=content
        if media_file:
            post.media_file=media_file
        post.save()
        serializer = self.serializer_class(post,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
        
    
    def destroy(self,request,pk=None):
        post = self.queryset.filter(pk=pk).first()
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)
        if post.user != request.user:
            return Response({"error_message":"You do not have rights to delete this post."},status.HTTP_401_UNAUTHORIZED)
        post.delete()
        return Response({"message":"Post Deleted Succesfully"},status.HTTP_200_OK)

    def create(self,request):
        current_user=request.user
        content = request.data.get("content")
        media_file = request.data.get("media_file")
        if not content:
            return Response({"error_message":"You need to provide content for adding a post"},status.HTTP_400_BAD_REQUEST)

        post = Post.objects.create(content=content,user=current_user)
        if media_file:
            post.media_file = media_file
            post.save()
        serializer = self.serializer_class(post,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
        
    
    @action(detail=False,methods=['get'])
    def my_posts(self,request):
        posts =self.queryset.filter(user=request.user)
        serializer = self.serializer_class(posts,many=True)
        return Response(serializer.data,status.HTTP_200_OK) 
    
    @action(detail=False,methods=['get'])
    def user_posts(self,request,pk):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"error_message":"No user exist with this ID."},status.HTTP_400_BAD_REQUEST)
        
        if user == request.user:
            return Response({"error_message":"You can not get your own posts through this endpoint."},status.HTTP_401_UNAUTHORIZED)

        posts = self.queryset.filter(user=user,privacy__in=['public', 'friends'])
        serializer = self.serializer_class(posts,many=True)
        return Response(serializer.data,status.HTTP_200_OK)

    @action(detail=True,methods=['patch'])
    def like_post(self,request,pk):
        current_user = request.user
        post = self.queryset.filter(pk=pk).first()
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)

        if current_user not in post.likes.all():
            post.likes.add(current_user)
        else: 
            post.likes.remove(current_user)

        serializer = self.serializer_class(post,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
    
    @action(detail=True,methods=['post'])
    def add_comment(self,request,pk):
        current_user = request.user
        post = self.queryset.filter(pk=pk).first()
        content = request.data.get("content")

        if not content:
            return Response({"error_message":"You need to provide content for your comment."},status.HTTP_400_BAD_REQUEST)
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(user=current_user,post=post,content=content)
        comment.save()

        serializer = self.serializer_class(post,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
    
    @action(detail=True,methods=['delete'])
    def delete_comment(self,request,pk):
        comment = Comment.objects.filter(pk=pk).first()
        if not comment:
            return Response({"error_message":"No comment exist with this ID."},status.HTTP_400_BAD_REQUEST)
        if request.user != comment.user and comment.post.user!=request.user:
            return Response({"error_message":"You do not have permissions to delete this comment"},status.HTTP_401_UNAUTHORIZED)
        comment.delete()
        return Response({"message":"Comment Deleted Succesfully"},status.HTTP_200_OK)
    
    @action(detail=True,methods=['patch'])
    def edit_comment(self,request,pk):
        content = request.data.get("content")
        if not content:
            return Response({"error_message":"You need to provide content for editing this comment"},status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.filter(pk=pk).first()
        if not comment:
            return Response({"error_message":"No comment exist with this ID."},status.HTTP_400_BAD_REQUEST)
        if request.user != comment.user:
            return Response({"error_message":"You do not have permissions to edit this comment"},status.HTTP_401_UNAUTHORIZED)
        comment.content=content
        comment.edited=True
        comment.edited_at=datetime.now()
        comment.save()
        serializer = self.serializer_class(comment.post,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
    



         
    
    ## Might Use This Later
    
    # def get_permissions(self):
    #     if self.action == 'list':
    #         # Apply a different permission class for the list view
    #         return [permissions.IsAuthenticated]
    #     elif self.action == 'retrieve':
    #         # Apply a different permission class for the retrieve view
    #         return [CustomRetrievePermission]
    #     elif self.action == 'custom_get':
    #         # Apply a custom permission class for a custom GET method
    #         return [CustomGetPermission]
    #     else:
    #         # Apply a default permission class for other methods (e.g., POST, PUT, DELETE)
    #         return [permissions.IsAdminUser]
    

    