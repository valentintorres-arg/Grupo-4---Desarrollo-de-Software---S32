from rest_framework import serializers
from .models import Paciente, ObraSocial, Antecedente, EntradaAntecedente, Turno, EstadoTratamiento, Tratamiento, Odontograma, OdontogramaDatos

class ObraSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObraSocial
        fields = ['id', 'nombre', 'cobertura']

class PacienteSerializer(serializers.ModelSerializer):
    obraSocial_data = ObraSocialSerializer(source='obraSocial', read_only=True)
    genero_display = serializers.CharField(source='get_genero_display', read_only=True)
    
    class Meta:
        model = Paciente
        fields = [
            'id', 'dni', 'nombre', 'apellido', 'fecha_nacimiento', 'genero', 'genero_display',
            'email', 'telefono', 'direccion', 'numeroOS', 'obraSocial', 'obraSocial_data',
            'contacto_emergencia_nombre', 'contacto_emergencia_relacion', 'contacto_emergencia_telefono'
        ]

class EntradaAntecedenteSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)

    class Meta:
        model = EntradaAntecedente
        fields = [
            'id',
            'paciente',
            'fecha', 
            'antecedente',
            'paciente_nombre',
            'paciente_apellido'
        ]

    def validate_fecha(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("La fecha del antecedente no puede ser futura.")
        return value

class AntecedenteSerializer(serializers.ModelSerializer):
    entrada_antecedente_data = EntradaAntecedenteSerializer(source='entradaAntecedente', read_only=True)
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)
    
    class Meta:
        model = Antecedente
        fields = [
            'id',
            'paciente',
            'entradaAntecedente',
            'entrada_antecedente_data',
            'paciente_nombre',
            'paciente_apellido'
        ]

class TurnoSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)
    paciente_dni = serializers.IntegerField(source='paciente.dni', read_only=True)
    odontologo_nombre = serializers.CharField(source='odontologo.nombre', read_only=True)
    odontologo_apellido = serializers.CharField(source='odontologo.apellido', read_only=True)
    odontologo_matricula = serializers.CharField(source='odontologo.matricula', read_only=True)
    especialidad = serializers.CharField(source='odontologo.especialidad.nombre', read_only=True)
    
    class Meta:
        model = Turno
        fields = [
            'id',
            'fecha',
            'hora', 
            'duracion',
            'motivo',
            'paciente',
            'odontologo',
            'paciente_nombre',
            'paciente_apellido',
            'paciente_dni',
            'odontologo_nombre',
            'odontologo_apellido',
            'odontologo_matricula',
            'especialidad'
        ]
        extra_kwargs = {
            'odontologo': {'read_only': True}
        }

    def validate_fecha(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("La fecha del turno no puede ser en el pasado.")
        return value

    def validate(self, data):
        from datetime import datetime
        # Validar que la hora esté en horario de trabajo (ejemplo: 8:00 a 18:00)
        hora = data.get('hora')
        if hora:
            if hora.hour < 8 or hora.hour > 18:
                raise serializers.ValidationError({
                    'hora': 'Los turnos deben estar entre las 8:00 y las 18:00 horas.'
                })
        
        return data
    
class EstadoTratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoTratamiento
        fields = ['id', 'nombre', 'descripcion']

class TratamientoSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)
    paciente_dni = serializers.CharField(source='paciente.dni', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)
    odontologo_nombre = serializers.CharField(source='odontologo.nombre', read_only=True)
    odontologo_apellido = serializers.CharField(source='odontologo.apellido', read_only=True)
    odontologo_matricula = serializers.CharField(source='odontologo.matricula', read_only=True)
    
    class Meta:
        model = Tratamiento
        fields = [
            'id', 'nombre', 'descripcion', 'paciente', 'estado', 'fecha_inicio', 
            'fecha_fin', 'duracion_estimada', 'odontologo', 'created_at', 'updated_at',
            'paciente_nombre', 'paciente_apellido', 'paciente_dni', 'estado_nombre',
            'odontologo_nombre', 'odontologo_apellido', 'odontologo_matricula'
        ]
        read_only_fields = ['created_at', 'updated_at']
        
    def validate_fecha_inicio(self, value):
        from datetime import date
        # Solo validar fecha futura en creaciones, no en actualizaciones
        if not self.instance and value > date.today():
            from rest_framework import serializers
            raise serializers.ValidationError("La fecha de inicio no puede ser futura.")
        return value
        
    def validate(self, attrs):
        # En actualizaciones, si no se proporciona odontologo, usar el existente
        if self.instance and 'odontologo' not in attrs:
            attrs['odontologo'] = self.instance.odontologo
        return attrs

class OdontogramaDatosSerializer(serializers.ModelSerializer):
    superficie_display = serializers.CharField(source='get_superficie_display', read_only=True)
    color_display = serializers.CharField(source='get_color_codigo_display', read_only=True)
    
    class Meta:
        model = OdontogramaDatos
        fields = [
            'id', 'fdi', 'superficie', 'superficie_display', 
            'color_codigo', 'color_display'
        ]

class OdontogramaSerializer(serializers.ModelSerializer):
    datos = OdontogramaDatosSerializer(many=True, read_only=True)
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)
    
    class Meta:
        model = Odontograma
        fields = [
            'id', 'paciente', 'created_at', 'updated_at',
            'paciente_nombre', 'paciente_apellido', 'datos'
        ]
        read_only_fields = ['created_at', 'updated_at']