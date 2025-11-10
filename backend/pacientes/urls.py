from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PacienteViewSet, ObraSocialViewSet, AntecedenteViewSet,
    EntradaAntecedenteViewSet, TurnoViewSet, EstadoTratamientoViewSet,
    TratamientoViewSet, OdontogramaDatosViewSet, OdontogramaViewSet,
    EvolucionViewSet
)

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'obras-sociales', ObraSocialViewSet)
router.register(r'entradas-antecedentes', EntradaAntecedenteViewSet, basename='entradas-antecedentes')
router.register(r'antecedentes', AntecedenteViewSet, basename='antecedentes')
router.register(r'turnos', TurnoViewSet, basename='turnos')
router.register(r'tratamientos', TratamientoViewSet, basename='tratamiento')
router.register(r'estados-tratamiento', EstadoTratamientoViewSet)
router.register(r'odontogramas', OdontogramaViewSet, basename='odontograma')
router.register(r'odontograma-datos', OdontogramaDatosViewSet, basename='odontograma-datos')
router.register(r'evoluciones', EvolucionViewSet, basename='evoluciones')

urlpatterns = [
    path('', include(router.urls))
]