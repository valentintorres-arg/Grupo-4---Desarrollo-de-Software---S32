from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import OdontologoTokenObtainPairSerializer

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