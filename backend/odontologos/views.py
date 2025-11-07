from django.shortcuts import render
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Odontologo, Especialidad
from .serializers import OdontologoTokenObtainPairSerializer, OdontologoSerializer, EspecialidadSerializer

class OdontologoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Odontologo.objects.all()
    serializer_class = OdontologoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Odontologo.objects.all().order_by('apellido', 'nombre')

class EspecialidadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Especialidad.objects.all().order_by('nombre')

# Create your views here.
class OdontologoTokenObtainPairView(TokenObtainPairView):
    serializer_class = OdontologoTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPerfilOdontologo(request):
    try:
        odontologo = request.user.odontologo
        return Response({
            'matricula': odontologo.matricula,
            'nombre': odontologo.nombre.title(),
            'apellido': odontologo.apellido.title(),
            'nombre_completo': f"{odontologo.nombre.title()} {odontologo.apellido.title()}",
            'especialidad': odontologo.especialidad.nombre
        })
    except:
        return Response({'error': 'No es un odontologo valido'}, status=400)