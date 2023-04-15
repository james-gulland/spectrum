from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers.common import UserSerializer
from rest_framework import status

from lib.exceptions import exceptions

class RegisterView(APIView):

    # REGISTER single user
    @exceptions
    def post(self, request):
      # print('REQUEST DATA -> ', request.data)

      user_to_add = UserSerializer(data=request.data)
      user_to_add.is_valid(raise_exception=True)
      user_to_add.save()

      # return Response('HIT register route')
      return Response(user_to_add.data, status.HTTP_201_CREATED)
