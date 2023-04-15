from .common import MixtapeSerializer
from ..models import Mixtape
from moods.serializers.common import MoodSerializer

# this serializer extends the one in common but populates the mood fields
class PopulatedMixtapeSerializer(MixtapeSerializer):
    class Meta:
        model = Mixtape
        fields = '__all__'
    moods = MoodSerializer(many=True)