from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Paciente, ObraSocial
from .serializers import PacienteSerializer, ObraSocialSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Paciente.objects.all()
        dni = self.request.query_params.get('dni', None)
        if dni is not None:
            queryset = queryset.filter(dni=dni)
        return queryset.order_by('apellido', 'nombre')
    
class ObraSocialViewSet(viewsets.ModelViewSet):
    queryset = ObraSocial.objects.all()
    serializer_class = ObraSocialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ObraSocial.objects.all().order_by('nombre')