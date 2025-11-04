from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Paciente, ObraSocial, Antecedente, EntradaAntecedente
from .serializers import PacienteSerializer, ObraSocialSerializer, EntradaAntecedenteSerializer, AntecedenteSerializer

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
    
class EntradaAntecedenteViewSet(viewsets.ModelViewSet):
    serializer_class = EntradaAntecedenteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = EntradaAntecedente.objects.all()
        paciente_id = self.request.query_params.get('paciente', None)
        if paciente_id is not None:
            queryset = queryset.filter(paciente_id=paciente_id)
        return queryset.order_by('-fecha')

    def perform_create(self, serializer):
        entrada = serializer.save()
        Antecedente.objects.create(
            paciente=entrada.paciente,
            entradaAntecedente=entrada
        )

    @action(detail=False, methods=['get'])
    def por_paciente(self, request):
        paciente_id = request.query_params.get('paciente_id')
        if not paciente_id:
            return Response(
                {'error': 'Se requiere el parámetro paciente_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            entradas = EntradaAntecedente.objects.filter(paciente_id=paciente_id).order_by('-fecha')
            serializer = self.get_serializer(entradas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AntecedenteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AntecedenteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Antecedente.objects.all()
        paciente_id = self.request.query_params.get('paciente', None)
        if paciente_id is not None:
            queryset = queryset.filter(paciente_id=paciente_id)
        return queryset.order_by('-entradaAntecedente__fecha')