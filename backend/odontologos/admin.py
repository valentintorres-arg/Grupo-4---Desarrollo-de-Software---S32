from django.contrib import admin
from django import forms
from .models import Odontologo, Especialidad
from django.contrib.auth.models import User

# Register your models here.
class OdontologoAdminForm(forms.ModelForm):
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput, required=True)
    
    class Meta:
        model = Odontologo
        fields = ['matricula', 'nombre', 'apellido', 'especialidad', 'password']

    def save(self, commit=True):
        matricula = self.cleaned_data['matricula'].lower()
        nombre = self.cleaned_data['nombre'].lower()
        apellido = self.cleaned_data['apellido'].lower()
        password = self.cleaned_data['password']
        user = User.objects.create_user(
            username=matricula,
            first_name=nombre,
            last_name=apellido,
            password=password
        )
        odontologo = super().save(commit=False)
        odontologo.user = user
        if commit:
            odontologo.save()
        return odontologo


class OdontologoAdmin(admin.ModelAdmin):
    form = OdontologoAdminForm
    exclude = ('user',) 

admin.site.register(Especialidad)
admin.site.register(Odontologo, OdontologoAdmin)