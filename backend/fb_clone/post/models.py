from django.db import models
from user_management.models import User
from django.core.exceptions import ValidationError

def validate_image_or_video(value):
    file_extension = value.name.split('.')[-1].lower()
    if file_extension not in ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi']:
        raise ValidationError("File type not supported. Please upload a valid image or video file.")


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    comments = models.ManyToManyField(User, through='Comment', related_name='post_comments', blank=True)
    media_file = models.FileField(upload_to='post_media/', blank=True, null=True,validators=[validate_image_or_video])
    privacy = models.CharField(max_length=10, choices=[
        ('public', 'Public'),
        ('friends', 'Friends'),
        ('private', 'Private')
    ], default='friends')
    edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True,null=True)

    def __str__(self):
        return f'Post by {self.user.full_name}'
    
    def is_image(self):
        return self.media_file.name.split('.')[-1] in ['jpg','jpeg','png']


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='comment_likes', blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True,null=True)

    def truncate_content(self):
        return self.content if len(self.content) < 40 else self.content[:40]
    
    def __str__(self):
        return self.truncate_content()


class SharedPost(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField()
    likes = models.ManyToManyField(User, related_name='shared_post_likes', blank=True)
    shared_at = models.DateTimeField(auto_now_add=True)
    edited=models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True,null=True)
    privacy = models.CharField(max_length=10, choices=[
        ('public', 'Public'),
        ('friends', 'Friends'),
        ('private', 'Private')
    ], default='friends')

