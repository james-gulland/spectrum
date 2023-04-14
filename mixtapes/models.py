from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Mixtape(models.Model):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE)
    track_name = models.CharField(max_length=100)
    artist_name = models.CharField(max_length=100)
    genre = models.CharField(null=True, blank=True)
    channel_source = models.CharField()
    source_url = models.URLField(validators=[URLValidator()])
    artwork_url = models.URLField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    release_date = models.DateTimeField(null=True, blank=True)
    moods = models.ManyToManyField('moods.Mood', related_name='mixtapes')
    date_added = models.DateTimeField(auto_now_add=True) #date/time when automatically added.

    def __str__(self):
        return f"{self.artist_name} - {self.track_name} ({self.channel_source})"
