from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Paciente
from .serializers import PacienteSerializer
from .models import (
    Paciente, EntradaAntecedente, Consulta, Pago, Insumo, Tratamiento
)
from .serializers import (
    PacienteSerializer, InsumoSerializer, EntradaAntecedenteSerializer,
    ConsultaSerializer, PagoSerializer, TratamientoResumenSerializer
)



class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]
    
# --- ABML de Insumos ---
class InsumoViewSet(viewsets.ModelViewSet):
    """
    CRUD de Insumos:
    - Lista/crea en     /api/insumos/
    - Detalle/edita/borra en /api/insumos/{id}/
    Justificación: ModelViewSet expone create/read/update/delete con mínimo código.
    """
    queryset = Insumo.objects.all().order_by("id")
    serializer_class = InsumoSerializer
    permission_classes = [IsAuthenticated]


# --- Pacientes + Historial clínico ---
class PacienteViewSets(viewsets.ModelViewSet): #En este ViewSet esta la accion historial relacionada con el paciente.
    """
    ABML de Pacientes + acción de historial clínico:
    - /api/pacientes/
    - /api/pacientes/{id}/
    - /api/pacientes/{id}/historial/  (acción GET que consolida toda la info clínica)
    """
    queryset = Paciente.objects.all().order_by("id")
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def historial(self, request, pk=None):
        """
        Devuelve el historial clínico consolidado del paciente:
        - Entradas de antecedentes
        - Tratamientos (con comentarios)      [TratamientoResumenSerializer]
        - Consultas (con fotos, prácticas e insumos usados)  [ConsultaSerializer]
        - Pagos del paciente y pagos por consulta             [PagoSerializer]

        Se usan select_related/prefetch_related para evitar N+1 queries.
        """
        paciente = self.get_object()

        antecedentes_qs = (
            EntradaAntecedente.objects
            .filter(paciente=paciente)
            .order_by("-fecha")
        )

        tratamientos_qs = (
            Tratamiento.objects
            .filter(paciente=paciente)
            .prefetch_related("comentarios")
            .order_by("-fecha_inicio")
        )

        consultas_qs = (
            Consulta.objects
            .filter(paciente=paciente)
            .select_related("odontologo", "tratamiento")
            .prefetch_related(
                "fotos",
                "usos_insumos__insumo",
                "consultas_practicas__practica",
                "pagos",
            )
            .order_by("-fecha")
        )

        pagos_qs = Pago.objects.filter(paciente=paciente).order_by("-fecha")

        data = {
            "paciente": {
                "id": paciente.id,
                "dni": paciente.dni,
                "nombre": paciente.nombre,
                "apellido": paciente.apellido,
            },
            "antecedentes": EntradaAntecedenteSerializer(antecedentes_qs, many=True).data,
            "tratamientos": TratamientoResumenSerializer(tratamientos_qs, many=True).data,
            "consultas": [],
            "pagos": PagoSerializer(pagos_qs, many=True).data,
        }

        for c in consultas_qs:
            c_data = ConsultaSerializer(c).data
            # Adjuntamos pagos de esa consulta (ya prefetch-eados)
            c_data["pagos"] = [
                {"id": p.id, "total": p.total, "fecha": p.fecha}
                for p in c.pagos.all()
            ]
            # Nombres legibles (útiles en el front)
            c_data["odontologo_str"] = str(c.odontologo) if c.odontologo else None
            c_data["tratamiento_str"] = str(c.tratamiento) if c.tratamiento else None
            data["consultas"].append(c_data)

        return Response(data)
