from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class OdontologoTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not hasattr(user, 'odontologo'):
            raise serializers.ValidationError('No tiene permisos de odontologo')
        return data