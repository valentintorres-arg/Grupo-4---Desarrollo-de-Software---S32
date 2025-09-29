from rest_framework import serializers
from .models import (
    Paciente, EntradaAntecedente, Consulta, Pago, Insumo,
    UsoInsumo, Practica, ConsultaXPractica, ConsultaFoto, Tratamiento, Comentario
)

class ObraSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObraSocial
        fields = ['id', 'nombre', 'cobertura']

class PacienteSerializer(serializers.ModelSerializer):
    obraSocial_data = ObraSocialSerializer(source = 'obraSocial', read_only = True)
    class Meta:
        model = Paciente
        fields = ['dni', 'nombre', 'apellido', 'edad', 'email', 'numeroOS', 'obraSocial', 'obraSocial_data']
        

# ABML Insumos
class InsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insumo
        fields = "__all__"


# Serializers de apoyo para armar el historial
class EntradaAntecedenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntradaAntecedente
        fields = ["id", "fecha", "antecedente"]

class ConsultaFotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaFoto
        fields = ["id", "url", "nota"]

class UsoInsumoSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.CharField(source="insumo.nombre", read_only=True)
    class Meta:
        model = UsoInsumo
        fields = ["id", "insumo", "insumo_nombre", "cantidad", "precio_unitario_al_uso"]

class ConsultaPracticaItemSerializer(serializers.ModelSerializer):
    practica_codigo = serializers.CharField(source="practica.codigo", read_only=True)
    practica_nombre = serializers.CharField(source="practica.nombre", read_only=True)
    class Meta:
        model = ConsultaXPractica
        fields = ["id", "practica", "practica_codigo", "practica_nombre", "cantidad", "precio_unitario_al_momento", "notas"]

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ["id", "total", "fecha", "consulta"]

class ConsultaSerializer(serializers.ModelSerializer):
    fotos = ConsultaFotoSerializer(many=True, read_only=True)
    usos_insumos = UsoInsumoSerializer(many=True, read_only=True)
    consultas_practicas = ConsultaPracticaItemSerializer(many=True, read_only=True)

    class Meta:
        model = Consulta
        fields = [
            "id", "paciente", "tratamiento", "odontologo",
            "descripcion", "fecha", "fotos", "usos_insumos", "consultas_practicas"
        ]

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ["id", "nota", "fecha"]

class TratamientoResumenSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)
    class Meta:
        model = Tratamiento
        fields = ["id", "nombre", "estado", "fecha_inicio", "fecha_fin", "comentarios"]

class PacienteSerializer(serializers.ModelSerializer):
    """Serializer base para ABML de pacientes (sin historial completo)."""
    class Meta:
        model = Paciente
        fields = ["id", "dni", "nombre", "apellido", "edad", "email", "numeroOS", "obraSocial"]