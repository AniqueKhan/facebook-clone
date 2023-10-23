from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user_management.serializers import (
    RegisterSerializer,LoginSerializer,ProfileSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# Create Tokens Manually For Users
# From the original documentation from Simple JWT

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['full_name'] = user.full_name
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