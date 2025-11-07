from django.shortcuts import render
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Paciente, ObraSocial, Antecedente, EntradaAntecedente, Turno, EstadoTratamiento, Tratamiento, OdontogramaDatos, Odontograma
from .serializers import PacienteSerializer, ObraSocialSerializer, EntradaAntecedenteSerializer, AntecedenteSerializer, TurnoSerializer, EstadoTratamientoSerializer, TratamientoSerializer, OdontogramaDatosSerializer, OdontogramaSerializer

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

class TurnoViewSet(viewsets.ModelViewSet):
    serializer_class = TurnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Turno.objects.all()
        paciente_id = self.request.query_params.get('paciente', None)
        odontologo_id = self.request.query_params.get('odontologo', None)
        fecha = self.request.query_params.get('fecha', None)
        
        if paciente_id is not None:
            queryset = queryset.filter(paciente_id=paciente_id)
        if odontologo_id is not None:
            queryset = queryset.filter(odontologo_id=odontologo_id)
        if fecha is not None:
            queryset = queryset.filter(fecha=fecha)
            
        return queryset.order_by('fecha', 'hora')

    def perform_create(self, serializer):
        # Automáticamente asignar el odontólogo logueado
        try:
            odontologo = self.request.user.odontologo
            serializer.save(odontologo=odontologo)
        except AttributeError:
            raise serializers.ValidationError("El usuario logueado no es un odontólogo válido")

    @action(detail=False, methods=['get'])
    def por_paciente(self, request):
        paciente_id = request.query_params.get('paciente_id')
        if not paciente_id:
            return Response(
                {'error': 'Se requiere el parámetro paciente_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            turnos = Turno.objects.filter(paciente_id=paciente_id).order_by('fecha', 'hora')
            serializer = self.get_serializer(turnos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def por_odontologo(self, request):
        odontologo_id = request.query_params.get('odontologo_id')
        if not odontologo_id:
            return Response(
                {'error': 'Se requiere el parámetro odontologo_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            turnos = Turno.objects.filter(odontologo_id=odontologo_id).order_by('fecha', 'hora')
            serializer = self.get_serializer(turnos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def agenda_dia(self, request):
        fecha = request.query_params.get('fecha')
        odontologo_id = request.query_params.get('odontologo_id')
        
        if not fecha:
            return Response(
                {'error': 'Se requiere el parámetro fecha'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            queryset = Turno.objects.filter(fecha=fecha)
            if odontologo_id:
                queryset = queryset.filter(odontologo_id=odontologo_id)
            
            turnos = queryset.order_by('hora')
            serializer = self.get_serializer(turnos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class EstadoTratamientoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EstadoTratamiento.objects.all()
    serializer_class = EstadoTratamientoSerializer
    permission_classes = [IsAuthenticated]

class TratamientoViewSet(viewsets.ModelViewSet):
    serializer_class = TratamientoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Tratamiento.objects.all()
        paciente_id = self.request.query_params.get('paciente', None)
        odontologo_id = self.request.query_params.get('odontologo', None)
        estado_id = self.request.query_params.get('estado', None)
        
        if paciente_id is not None:
            queryset = queryset.filter(paciente_id=paciente_id)
        if odontologo_id is not None:
            queryset = queryset.filter(odontologo_id=odontologo_id)
        if estado_id is not None:
            queryset = queryset.filter(estado_id=estado_id)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Automáticamente asignar el odontólogo logueado
        try:
            odontologo = self.request.user.odontologo
            serializer.save(odontologo=odontologo)
        except AttributeError:
            raise serializers.ValidationError("El usuario logueado no es un odontólogo válido")
    
    def perform_update(self, serializer):
        # El serializer ya maneja el odontologo en validate()
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def por_paciente(self, request):
        paciente_id = request.query_params.get('paciente_id')
        if not paciente_id:
            return Response(
                {'error': 'Se requiere el parámetro paciente_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            tratamientos = Tratamiento.objects.filter(paciente_id=paciente_id).order_by('-created_at')
            serializer = self.get_serializer(tratamientos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['patch'])
    def finalizar(self, request, pk=None):
        tratamiento = self.get_object()
        fecha_fin = request.data.get('fecha_fin')
        
        if not fecha_fin:
            return Response(
                {'error': 'Se requiere la fecha_fin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Buscar el estado "Finalizado" o crearlo si no existe
            estado_finalizado, created = EstadoTratamiento.objects.get_or_create(
                nombre="Finalizado",
                defaults={'descripcion': 'Tratamiento completado exitosamente'}
            )
            
            tratamiento.fecha_fin = fecha_fin
            tratamiento.estado = estado_finalizado
            tratamiento.save()
            
            serializer = self.get_serializer(tratamiento)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class OdontogramaViewSet(viewsets.ModelViewSet):
    serializer_class = OdontogramaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Odontograma.objects.prefetch_related('datos').all()
        paciente_id = self.request.query_params.get('paciente', None)
        if paciente_id is not None:
            queryset = queryset.filter(paciente_id=paciente_id)
        return queryset.order_by('-updated_at')
    
    @action(detail=True, methods=['post'])
    def actualizar_superficie(self, request, pk=None):
        odontograma = self.get_object()
        fdi = request.data.get('fdi')
        superficie = request.data.get('superficie')
        color_codigo = request.data.get('color_codigo')
        
        if not all([fdi, superficie, color_codigo]):
            return Response(
                {'error': 'Se requieren fdi, superficie y color_codigo'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            datos, created = OdontogramaDatos.objects.update_or_create(
                odontograma=odontograma,
                fdi=fdi,
                superficie=superficie,
                defaults={'color_codigo': color_codigo}
            )
            
            serializer = OdontogramaDatosSerializer(datos)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get', 'post'])
    def por_paciente(self, request):
        paciente_id = request.query_params.get('paciente_id') or request.data.get('paciente_id')
        
        if not paciente_id:
            return Response(
                {'error': 'Se requiere el parámetro paciente_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.method == 'GET':
            try:
                odontograma = Odontograma.objects.prefetch_related('datos').get(paciente_id=paciente_id)
                serializer = self.get_serializer(odontograma)
                return Response(serializer.data)
            except Odontograma.DoesNotExist:
                # Crear odontograma vacío si no existe
                paciente = Paciente.objects.get(id=paciente_id)
                odontograma = Odontograma.objects.create(paciente=paciente)
                serializer = self.get_serializer(odontograma)
                return Response(serializer.data)
        
        elif request.method == 'POST':
            # Crear o actualizar odontograma completo
            try:
                odontograma, created = Odontograma.objects.get_or_create(paciente_id=paciente_id)
                
                # Actualizar datos si se proporcionan
                datos_list = request.data.get('datos', [])
                for dato in datos_list:
                    OdontogramaDatos.objects.update_or_create(
                        odontograma=odontograma,
                        fdi=dato['fdi'],
                        superficie=dato['superficie'],
                        defaults={'color_codigo': dato['color_codigo']}
                    )
                
                # Devolver odontograma actualizado
                odontograma.refresh_from_db()
                serializer = self.get_serializer(odontograma)
                return Response(serializer.data)
            except Exception as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

class OdontogramaDatosViewSet(viewsets.ModelViewSet):
    serializer_class = OdontogramaDatosSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = OdontogramaDatos.objects.all()
        odontograma_id = self.request.query_params.get('odontograma', None)
        fdi = self.request.query_params.get('fdi', None)
        
        if odontograma_id is not None:
            queryset = queryset.filter(odontograma_id=odontograma_id)
        if fdi is not None:
            queryset = queryset.filter(fdi=fdi)
            
        return queryset.order_by('fdi', 'superficie')