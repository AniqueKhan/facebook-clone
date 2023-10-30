from django.contrib import admin
from post.models import Post,Comment,SharedPost
# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = ['id',"content","privacy"]
    save_as = True
admin.site.register(Post,PostAdmin)
admin.site.register(Comment)
admin.site.register(SharedPost)