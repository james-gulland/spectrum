from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Mixtape
from .serializers.common import MixtapeSerializer
from .serializers.populated import PopulatedMixtapeSerializer

# importing exceptions to capture errors
from lib.exceptions import exceptions

# view is for /api/mixtapes/
class MixtapeListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    
    # GET all mixtapes
    def get(self, request):
        # debug mode on
        print('GET api/mixtapes/ endpoint hit')

        # querying mixtape table in db and returning all records
        # we can't use this format of data, so need to serialize it
        mixtapes = Mixtape.objects.all()

        # to update for future:
        # mixtapes = Mixtape.objects.filter(owner=request.user)

        serialized_mixtapes = PopulatedMixtapeSerializer(mixtapes, many=True) # populated serializer includes the many-to-many relationship with Moods

        # return Response ('GET api/mixtapes/ endpoint hit')
        return Response(serialized_mixtapes.data)
    
    # POST a single mixtape
    @exceptions
    def post(self, request):
        # debug mode on
        print('POST api/mixtapes/ endpoint hit')

        # populating the owner data automatically without user having to specify in the request
        # print('REQUEST USER ID ->', request.user.id)
        request.data['owner'] = request.user.id
        # print('REQUEST DATA ->', request.data)

        # deserializing data to send back to db, checking it, and then saving
        mixtape = MixtapeSerializer(data=request.data)
        mixtape.is_valid(raise_exception=True)
        mixtape.save()

        # return Response ('POST api/mixtapes/ endpoint hit')
        return Response(mixtape.data, status.HTTP_201_CREATED)

# view is for /api/mixtapes/:pk
class MixtapeDetailView(APIView):
    permission_classes = (IsAuthenticated,)
    
    # GET a single mixtape
    @exceptions
    def get(self, request, pk):
        mixtape = Mixtape.objects.get(pk=pk)
        serialized_mixtape = PopulatedMixtapeSerializer(mixtape) # populated serializer includes the many-to-many relationship with Moods

        return Response(serialized_mixtape.data)
    
    # UPDATE a single mixtape
    @exceptions
    def put(self, request, pk):
        mixtape = Mixtape.objects.get(pk=pk)

        if mixtape.owner != request.user:
            raise PermissionDenied()
        
        # deserialize data and enable partial updates, validating, and saving
        serialized_mixtape = MixtapeSerializer(mixtape, request.data, partial=True)
        serialized_mixtape.is_valid(raise_exception=True)
        serialized_mixtape.save()

        return Response(serialized_mixtape.data)
    
    # DELETE a single mixtape
    @exceptions
    def delete(self, request, pk):
        mixtape = Mixtape.objects.get(pk=pk)
        # print('MIXTAPE OWNER ->', mixtape.owner)
        # print('REQUESR USER ->', request.user)
        # print('MATCH? ->', request.user == mixtape.owner)
        if mixtape.owner != request.user:
            raise PermissionDenied()
        mixtape.delete() # that was easy :)

        return Response(status=status.HTTP_204_NO_CONTENT)