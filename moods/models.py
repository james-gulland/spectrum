from django.db import models

# Create your models here.
class Mood(models.Model):
    name = models.CharField(max_length=50)
    ui_colour = models.CharField(max_length=50)

    def __str__(self):
      return self.name