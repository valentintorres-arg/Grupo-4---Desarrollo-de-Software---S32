from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Odontologo, Especialidad

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre']

class OdontologoSerializer(serializers.ModelSerializer):
    especialidad_data = EspecialidadSerializer(source='especialidad', read_only=True)
    
    class Meta:
        model = Odontologo
        fields = [
            'id', 
            'matricula', 
            'nombre', 
            'apellido', 
            'especialidad',
            'especialidad_data'
        ]

class OdontologoTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not hasattr(user, 'odontologo'):
            raise serializers.ValidationError('No tiene permisos de odontologo')
        return data