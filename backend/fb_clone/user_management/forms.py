from django.forms import ModelForm,ValidationError
from user_management.models import User
class CustomUserAdminForm(ModelForm):
    model = User

    def clean_friends(self):
        friends = self.cleaned_data.get("friends")
        if self.instance in friends:
            raise ValidationError("A user can not be friends with themselves")
        return friends   