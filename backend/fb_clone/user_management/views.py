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


class ProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,format=None):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data,status.HTTP_200_OK)
        
class FriendRequestView(ModelViewSet):
    queryset = FriendRequest.objects.all()
    http_method_names = ['get','post']
    permission_classes = [IsAuthenticated]

    def list(self,request):
        return Response({"message": "Get all method disabled"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self,request,pk=None):
        return Response({"message": "Get single method disabled"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False,methods=['GET'])
    def sent_requests(self,request):
        queryset = self.queryset.filter(from_user=request.user)
        serializer = FriendRequestSerializer(queryset,many=True)
        return Response(serializer.data,status.HTTP_200_OK)

    @action(detail=False,methods=['GET'])
    def received_requests(self,request):
        queryset = self.queryset.filter(to_user=request.user,status="P")
        serializer = FriendRequestSerializer(queryset,many=True)
        return Response(serializer.data,status.HTTP_200_OK)
    
    @action(detail=False, methods=["POST"])
    def send_request(self,request):
        if not request.data.get("to_user"):
            return Response({"message": "You need to provide a to_user"},
                        status=status.HTTP_400_BAD_REQUEST)
        
        from_user = request.user
        to_user_email = request.data.get("to_user") # Getting the email of the to_user
        to_user = User.objects.filter(email=to_user_email).first()

        # Can not send requests to yourself
        if to_user == from_user:
            return Response({"message":"You can not send friend requests to yourself"},status.HTTP_400_BAD_REQUEST)
        
        # The recipient email must be valid
        if not to_user:
            return Response({"message":"No user exists with this email"},status.HTTP_400_BAD_REQUEST)

        # The recipient must not already be a friend of the user
        if to_user in from_user.friends.all():
            return Response({"message":"This user is already your friend"},status.HTTP_400_BAD_REQUEST)

        # There should not be an already existing pending request
        if self.queryset.filter(from_user=from_user,to_user=to_user,status="P").exists():
            return Response({"message":"A friend request to this user is already pending"},status.HTTP_400_BAD_REQUEST)

        friend_request = FriendRequest.objects.create(from_user=from_user,to_user=to_user,status="P")
        serializer = FriendRequestSerializer(friend_request,many=False)
        return Response(serializer.data,status.HTTP_200_OK)
