from rest_framework import serializers
from .models import Paciente, ObraSocial

class ObraSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObraSocial
        fields = ['id', 'nombre', 'cobertura']

class PacienteSerializer(serializers.ModelSerializer):
    obraSocial_data = ObraSocialSerializer(source = 'obraSocial', read_only = True)
    class Meta:
        model = Paciente
        fields = ['dni', 'nombre', 'apellido', 'edad', 'email', 'numeroOS', 'obraSocial', 'obraSocial_data']