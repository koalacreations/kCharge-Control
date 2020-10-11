from django.http import JsonResponse

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class UserProfile(APIView):
    """
    get: This method returns the current user's profile.
    """

    def get(self, request):
        return JsonResponse(request.user.profile)
