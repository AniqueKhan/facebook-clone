from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from post.serializers import PostSerializer
from rest_framework.response import Response
from rest_framework import status
from user_management.models import User
from post.models import Post
from rest_framework.decorators import action
class PostView(ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names=['get','delete']
    serializer_class = PostSerializer

    def list(self,request):
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
    
    def destroy(self,request,pk=None):
        post = self.queryset.filter(pk=pk).first()
        if not post:
            return Response({"error_message":"No post exist with this ID."},status.HTTP_400_BAD_REQUEST)
        if post.user != request.user:
            return Response({"error_message":"You do not have rights to delete this post."},status.HTTP_401_UNAUTHORIZED)
        post.delete()
        return Response({"message":"Post Deleted Succesfully"},status.HTTP_200_OK)

    
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
    

    