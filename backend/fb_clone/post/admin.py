from django.contrib import admin
from post.models import Post,Comment
# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = ['id',"content","privacy"]
    save_as = True
admin.site.register(Post,PostAdmin)
admin.site.register(Comment)