from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, ObraSocialViewSet, AntecedenteViewSet, EntradaAntecedenteViewSet

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'obras-sociales', ObraSocialViewSet)
router.register(r'entradas-antecedentes', EntradaAntecedenteViewSet, basename='entradas-antecedentes')
router.register(r'antecedentes', AntecedenteViewSet, basename='antecedentes')

urlpatterns = [
    path('', include(router.urls))
]
