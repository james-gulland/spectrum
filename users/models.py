from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.CharField()
    volume = models.CharField()
    # The null=True and blank=True arguments allow for a user to not have a selected mood, 
    # indicated by a NULL value in the database
    mood = models.ForeignKey('moods.Mood', null=True, blank=True, on_delete=models.SET_NULL, related_name='users')