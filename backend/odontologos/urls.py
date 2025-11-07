from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import OdontologoTokenObtainPairView, getPerfilOdontologo, OdontologoViewSet, EspecialidadViewSet

router = DefaultRouter()
router.register(r'odontologos', OdontologoViewSet)
router.register(r'especialidades', EspecialidadViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', OdontologoTokenObtainPairView.as_view(), name='odontologo_login'),
    path('perfil/', getPerfilOdontologo, name='perfil_odontologo')
]