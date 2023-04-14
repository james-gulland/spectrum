from django.contrib import admin
from django.contrib.auth import get_user_model

# Register your models here.
# If we change this at a later date, we won't need to change this code as it will update accordingly
User = get_user_model()

# Register your models here.
admin.site.register(User)