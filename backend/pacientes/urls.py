from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, ObraSocialViewSet

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet)
router.register(r'obras-sociales', ObraSocialViewSet)

urlpatterns = [
    path('', include(router.urls))
]
