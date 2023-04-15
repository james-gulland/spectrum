from rest_framework.serializers import ModelSerializer
from ..models import Mood

class MoodSerializer(ModelSerializer):
    class Meta:
        model = Mood
        fields = ('name',)
