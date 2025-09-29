from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import OdontologoTokenObtainPairSerializer

# Create your views here.
class OdontologoTokenObtainPairView(TokenObtainPairView):
    serializer_class = OdontologoTokenObtainPairSerializer