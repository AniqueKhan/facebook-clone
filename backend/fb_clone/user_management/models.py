
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email,full_name,password=None,password2=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,full_name=full_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None):
        user = self.create_user(
            email,
            password=password,
            full_name=full_name,
        )
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email=models.EmailField(verbose_name="Email",max_length=255,unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("Male", "Male"), ("FemaleF", "Female"), ("Other", "Other")],blank=True,null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', null=True, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100,blank=True,null=True)
    friends = models.ManyToManyField("self",related_name="user_friends",blank=True)
    
    # Define any other fields you need here.

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    # Add fields for relationships (friends, posts, comments, etc.) here.

    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email

    def has_perm(self,perm,obj=None):
        return self.is_admin

    def has_module_perms(self,app):
        return True # Always true


class FriendRequest(models.Model):
    from_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="from_user")
    to_user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="to_user")
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(blank=True,null=True)
    status = models.CharField(max_length=255,choices=[("A","Accepted"),("R","Rejected"),("P","Pending")])


    def __str__(self):
        return f"Friend Request from {self.from_user} to {self.to_user}"