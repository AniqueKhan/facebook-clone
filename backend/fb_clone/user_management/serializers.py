from rest_framework import serializers
from user_management.models import User,FriendRequest
from django.utils.timesince import timesince

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =['email','full_name','password']
        extra_kwargs={
            "password":{"write_only":True}
        }

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = self.initial_data.get("password2")
        if password!=password2:
            raise serializers.ValidationError({"password":"Password and confirm password does not match"})
        return attrs
    
    def create(self,valid_data):
        return User.objects.create_user(**valid_data)
    
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email','password']

    

class ProfileSerializer(serializers.ModelSerializer):    
    class Meta:
        model = User
        fields = ['id','email','full_name','bio','profile_picture',"friends","gender","location"]


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = ProfileSerializer(many=False)
    to_user = ProfileSerializer(many=False)
    humanized_created_at = serializers.SerializerMethodField()

    def get_humanized_created_at(self,obj):
        return timesince(obj.created_at)
    class Meta:
        model = FriendRequest
        fields = ["id","from_user","to_user","status","humanized_created_at"]