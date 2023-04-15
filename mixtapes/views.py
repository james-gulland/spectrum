from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Mixtape
from .serializers.common import MixtapeSerializer

# view is for /api/mixtapes/
class MixtapeListView(APIView):
    
    # GET all mixtapes
    def get(self, request):
        # debug mode on
        print('GET api/mixtapes/ endpoint hit')

        # querying mixtape table in db and returning all records
        # we can't use this format of data, so need to serialize it
        mixtapes = Mixtape.objects.all()
        serialized_mixtapes = MixtapeSerializer(mixtapes, many=True)

        # return Response ('GET api/mixtapes/ endpoint hit')
        return Response(serialized_mixtapes.data)
    
    # POST a single mixtape
    def post(self, request):
      # debug mode on
      print('POST api/mixtapes/ endpoint hit')

      # deserialising data to send back to db, checking it, and then saving
      mixtape = MixtapeSerializer(data=request.data)
      mixtape.is_valid(raise_exception=True)
      mixtape.save()

      # return Response ('POST api/mixtapes/ endpoint hit')
      return Response(mixtape.data, status.HTTP_201_CREATED)

# view is for /api/mixtapes/:pk
class MixtapeDetailView(APIView):
    
    # GET a single mixtape
    def get(self, request, pk):
      mixtape = Mixtape.objects.get(pk=pk)
      serialized_mixtape = MixtapeSerializer(mixtape)

      return Response(serialized_mixtape.data)
    
    # UPDATE a single mixtape
    def put(self, request, pk):
      mixtape = Mixtape.objects.get(pk=pk)
      
      # deserialise data and enable partial updates, validating, and saving
      serialized_mixtape = MixtapeSerializer(mixtape, request.data, partial=True)
      serialized_mixtape.is_valid(raise_exception=True)
      serialized_mixtape.save()

      return Response(serialized_mixtape.data)
    
    # DELETE a single mixtape
    def delete(self, request, pk):
      mixtape = Mixtape.objects.get(pk=pk)
      mixtape.delete() # that was easy :)

      return Response(status=status.HTTP_204_NO_CONTENT)