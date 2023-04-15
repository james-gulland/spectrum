from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .serializers.common import UserSerializer
from rest_framework import status
import jwt
from datetime import datetime, timedelta
from django.conf import settings

from lib.exceptions import exceptions

from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):

    # REGISTER single user
    # Endpoint: POST /api/auth/register/
    @exceptions
    def post(self, request):
      # print('REQUEST DATA -> ', request.data)

      user_to_add = UserSerializer(data=request.data)
      user_to_add.is_valid(raise_exception=True)
      user_to_add.save()

      # return Response('HIT register route')
      return Response(user_to_add.data, status.HTTP_201_CREATED)

class LoginView(APIView):

    # LOGIN user
    # Endpoint: POST /api/auth/login/
    @exceptions
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        # If the user is found, we want to check the password matches the hash we have in our database
        if not user_to_login.check_password(password):
            print('PASSWORDS DONT MATCH')
            raise PermissionDenied('Unauthorized')
    
        # At this point the user is validated, so we can send the token back
        dt = datetime.now() + timedelta(days=7)


        token = jwt.encode({ 'sub':  user_to_login.id, 'exp': int(dt.strftime('%s')) }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)
        
        return Response({ 'message': f"Welcome back, {user_to_login.username}", 'token': token })
    
