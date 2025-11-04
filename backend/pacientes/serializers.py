from rest_framework import serializers
from .models import Paciente, ObraSocial, Antecedente

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

class AntecedentesSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)

    class Meta:
        model = Antecedente
        fields = [
            'id', 
            'paciente', 
            'fecha', 
            'descripcion', 
            'fecha_creacion', 
            'fecha_modificacion',
            'paciente_nombre',
            'paciente_apellido'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_modificacion']

    def validate_fecha(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("La fecha del antecedente no puede ser futura.")
        return value