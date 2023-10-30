# Generated by Django 3.2.22 on 2023-10-30 14:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import post.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('edited', models.BooleanField(default=False)),
                ('edited_at', models.DateTimeField(blank=True, null=True)),
                ('likes', models.ManyToManyField(blank=True, related_name='comment_likes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('media_file', models.FileField(blank=True, null=True, upload_to='post_media/', validators=[post.models.validate_image_or_video])),
                ('privacy', models.CharField(choices=[('public', 'Public'), ('friends', 'Friends'), ('private', 'Private')], default='friends', max_length=10)),
                ('edited', models.BooleanField(default=False)),
                ('edited_at', models.DateTimeField(blank=True, null=True)),
                ('shared', models.BooleanField(default=False)),
                ('shared_edited', models.BooleanField(default=False)),
                ('shared_edited_at', models.DateTimeField(blank=True, null=True)),
                ('shared_content', models.TextField(blank=True, null=True)),
                ('shared_at', models.DateTimeField(auto_now_add=True)),
                ('shared_privacy', models.CharField(choices=[('public', 'Public'), ('friends', 'Friends'), ('private', 'Private')], default='friends', max_length=10)),
                ('comments', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_comment', to='post.comment')),
                ('likes', models.ManyToManyField(blank=True, related_name='post_likes', to=settings.AUTH_USER_MODEL)),
                ('shared_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('shared_comments', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shared_post_comment', to='post.comment')),
                ('shared_likes', models.ManyToManyField(blank=True, related_name='shared_post_likes', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.post'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
