from rest_framework import serializers
from .models import Paciente, ObraSocial, Antecedente, EntradaAntecedente

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