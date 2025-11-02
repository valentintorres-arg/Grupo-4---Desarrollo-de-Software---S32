from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import OdontologoTokenObtainPairView, getPerfilOdontologo

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', OdontologoTokenObtainPairView.as_view(), name='odontologo_login'),
    path('perfil/', getPerfilOdontologo, name='perfil_odontologo')
]