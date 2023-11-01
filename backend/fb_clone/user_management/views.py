from rest_framework.response import Response
from rest_framework.views import APIView
from user_management.models import User
from rest_framework.decorators import action
from rest_framework import status
from user_management.models import FriendRequest
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from user_management.serializers import (
    RegisterSerializer,LoginSerializer,ProfileSerializer,FriendRequestSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from datetime import datetime

# Create Tokens Manually For Users
# From the original documentation from Simple JWT

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['full_name'] = user.full_name
    if user.profile_picture:refresh['profile_picture']=user.profile_picture.url
    return {
        "refresh":str(refresh),
        "access":str(refresh.access_token)
    }
class RegisterView(APIView):
    def post(self,request,format=None):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user=user)
            return Response({"token":token,"message":"Registration Successfully"},status.HTTP_201_CREATED)
        
class LoginView(APIView):
    def post(self,request,format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get("email")
            password = serializer.data.get("password")
            user=authenticate(email=email,password=password)

            if user is not None:
                token = get_tokens_for_user(user)
                return Response({"token":token,"message":"Login Successful"},status.HTTP_200_OK)
            return Response({"error":{"non_field_errors":['Invalid Credentials']}},status.HTTP_400_BAD_REQUEST)

class FriendRequestView(ModelViewSet):
    queryset = FriendRequest.objects.all()
    http_method_names = ['get','post','patch']
    permission_classes = [IsAuthenticated]

    def list(self,request):
        queryset = self.queryset.filter(to_user=request.user,status="P")
        serializer = FriendRequestSerializer(queryset,many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    
    def retrieve(self,request,pk=None):
        return Response({"error_message": "Get single method disabled"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False,methods=['GET'])
    def sent_requests(self,request):
        queryset = self.queryset.filter(from_user=request.user)
        serializer = FriendRequestSerializer(queryset,many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    
    @action(detail=False, methods=["POST"])
    def send_request(self,request):
        if not request.data.get("to_user"):
            return Response({"error_message": "You need to provide a to_user"},
                        status=status.HTTP_400_BAD_REQUEST)
        
        from_user = request.user
        to_user_email = request.data.get("to_user") # Getting the email of the to_user
        to_user = User.objects.filter(email=to_user_email).first()

        # Can not send requests to yourself
        if to_user == from_user:
            return Response({"error_message":"You can not send friend request to yourself"},status.HTTP_400_BAD_REQUEST)
        
        # The recipient email must be valid
        if not to_user:
            return Response({"error_message":"No user exists with this email"},status.HTTP_400_BAD_REQUEST)

        # The recipient must not already be a friend of the user
        if to_user in from_user.friends.all():
            return Response({"error_message":"This user is already your friend"},status.HTTP_400_BAD_REQUEST)

        # There should not be an already existing pending request
        if self.queryset.filter(from_user=from_user,to_user=to_user,status="P").exists():
            return Response({"error_message":"A friend request to this user is already pending"},status.HTTP_400_BAD_REQUEST)

        friend_request = FriendRequest.objects.create(from_user=from_user,to_user=to_user,status="P")
        serializer = FriendRequestSerializer(friend_request,many=False)
        return Response(serializer.data,status.HTTP_200_OK)


    @action(detail=True,methods=['patch'])
    def accept_request(self,request,pk):
        # Getting the current logged in user
        current_user = request.user

        # Getting the friend request using the primary key
        friend_request = FriendRequest.objects.filter(pk=pk).first()

        # The friend request should exist
        if not friend_request:
            return Response({"error_message":"There is no friend request with this id"},status.HTTP_400_BAD_REQUEST)
        
        if current_user in friend_request.from_user.friends.all():
            return Response({"error_message":"You are already friends with this user"},status.HTTP_400_BAD_REQUEST)

        if friend_request.status != "P":
            return Response({"error_message":"The status of this friend request is not pending. You can only accept pending friend requests"},status.HTTP_400_BAD_REQUEST)

        if friend_request.to_user != current_user:
            return Response({"error_message":"This friend request was not meant for you."},status.HTTP_400_BAD_REQUEST)

        friend_request.status = "A"
        friend_request.accepted_at = datetime.now()
        current_user.friends.add(friend_request.from_user)
        current_user.save()
        friend_request.save()
        serializer = FriendRequestSerializer(friend_request,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
    

class ProfileView(ModelViewSet):
    permission_classes=[IsAuthenticated]
    serializer_class = ProfileSerializer
    http_method_names = ['get','patch']

    def list(self,request):
        return Response({"error_message":"List method disabled"})
    
    def retrieve(self, request, pk):
        current_user = request.user
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"error_message":"No user exist with this id"})
        if user==current_user:
            serializer = self.serializer_class(request.user)
            return Response(serializer.data,status.HTTP_200_OK)
        serializer = self.serializer_class(user)
        return Response(serializer.data,status.HTTP_200_OK)
        
    
    def partial_update(self, request,pk=None):
        current_user=request.user
        full_name = request.data.get("full_name")
        bio = request.data.get("bio")
        location = request.data.get("location")
        gender = request.data.get("gender")
        email = request.data.get("email")

        if not full_name and not bio and not location and not gender and not email:
            return Response({"error_message":"You need to provide atleast one information to update your profile"})
        
        if full_name:current_user.full_name=full_name
        if bio:current_user.bio=bio
        if location:current_user.location=location
        if gender:current_user.gender=gender
        if email:current_user.email=email

        current_user.save()
        serializer = self.serializer_class(current_user)
        return Response(serializer.data,status.HTTP_200_OK)