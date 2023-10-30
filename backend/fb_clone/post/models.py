from django.db import models
from user_management.models import User
from django.core.exceptions import ValidationError

def validate_image_or_video(value):
    file_extension = value.name.split('.')[-1].lower()
    if file_extension not in ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi']:
        raise ValidationError("File type not supported. Please upload a valid image or video file.")


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="post_user")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    comments = models.ForeignKey("Comment",related_name="post_comment",blank=True,null=True,on_delete=models.CASCADE)
    media_file = models.FileField(upload_to='post_media/', blank=True, null=True,validators=[validate_image_or_video])
    privacy = models.CharField(max_length=10, choices=[
        ('public', 'Public'),
        ('friends', 'Friends'),
        ('private', 'Private')
    ], default='friends')
    edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True,null=True)

    # Shared Post Fields
    shared = models.BooleanField(default=False)
    shared_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True)
    shared_at = models.DateTimeField(blank=True,null=True)
    shared_edited = models.BooleanField(default=False)
    shared_edited_at = models.DateTimeField(blank=True,null=True)
    shared_content = models.TextField(blank=True,null=True)

    shared_at = models.DateTimeField(auto_now_add=True)
    shared_likes = models.ManyToManyField(User, related_name='shared_post_likes', blank=True)
    shared_comments = models.ForeignKey("Comment",related_name="shared_post_comment",null=True,on_delete=models.CASCADE, blank=True)
    shared_privacy = models.CharField(max_length=10, choices=[
        ('public', 'Public'),
        ('friends', 'Friends'),
        ('private', 'Private')
    ], default='friends')

    def truncate_content(self):
        return self.content if len(self.content) < 40 else self.content[:40]
    
    def __str__(self):
        return self.truncate_content()
    
    def is_image(self):
        return self.media_file.name.split('.')[-1] in ['jpg','jpeg','png']
    
    def save(self,*args,**kwargs):
        if self.privacy=="private" and self.shared:
            raise ValidationError("Private post can not be shared.")
        super(Post,self).save(*args,**kwargs)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="comment_user")
    likes = models.ManyToManyField(User, related_name='comment_likes', blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(blank=True,null=True)

    def truncate_content(self):
        return self.content if len(self.content) < 40 else self.content[:40]
    




