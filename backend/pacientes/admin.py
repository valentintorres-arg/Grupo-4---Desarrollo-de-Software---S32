from django.contrib import admin
from .models import ObraSocial, EstadoTratamiento, Tratamiento, Paciente, Antecedente, EntradaAntecedente, Turno, Odontograma, OdontogramaDatos, Evolucion

# Register your models here.

@admin.register(ObraSocial)
class ObraSocialAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cobertura')
    search_fields = ('nombre',)

@admin.register(EstadoTratamiento)
class EstadoTratamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)
    ordering = ('nombre',)

@admin.register(Tratamiento)
class TratamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'paciente', 'estado', 'fecha_inicio', 'fecha_fin', 'odontologo')
    list_filter = ('estado', 'fecha_inicio', 'odontologo')
    search_fields = ('nombre', 'paciente__nombre', 'paciente__apellido', 'paciente__dni')
    date_hierarchy = 'fecha_inicio'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Información General', {
            'fields': ('nombre', 'descripcion', 'paciente', 'odontologo')
        }),
        ('Estado y Fechas', {
            'fields': ('estado', 'fecha_inicio', 'fecha_fin', 'duracion_estimada')
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'dni', 'email', 'telefono', 'fecha_nacimiento')
    list_filter = ('genero', 'obraSocial')
    search_fields = ('nombre', 'apellido', 'dni', 'email')
    ordering = ('apellido', 'nombre')

@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'odontologo', 'fecha', 'hora', 'motivo', 'duracion')
    list_filter = ('fecha', 'odontologo')
    search_fields = ('paciente__nombre', 'paciente__apellido', 'paciente__dni', 'motivo')
    date_hierarchy = 'fecha'
    ordering = ('-fecha', '-hora')

@admin.register(EntradaAntecedente)
class EntradaAntecedenteAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'fecha', 'antecedente')
    list_filter = ('fecha',)
    search_fields = ('paciente__nombre', 'paciente__apellido', 'antecedente')
    date_hierarchy = 'fecha'
    ordering = ('-fecha',)

@admin.register(Antecedente)
class AntecedenteAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'entradaAntecedente')
    search_fields = ('paciente__nombre', 'paciente__apellido')
    ordering = ('paciente',)

@admin.register(Odontograma)
class OdontogramaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'created_at', 'updated_at')
    search_fields = ('paciente__nombre', 'paciente__apellido', 'paciente__dni')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(OdontogramaDatos)
class OdontogramaDatosAdmin(admin.ModelAdmin):
    list_display = ('odontograma', 'fdi', 'get_superficie_display', 'get_color_codigo_display')
    list_filter = ('superficie', 'color_codigo', 'fdi')
    search_fields = ('odontograma__paciente__nombre', 'odontograma__paciente__apellido')
    ordering = ('odontograma', 'fdi', 'superficie')
    
    def get_superficie_display(self, obj):
        return obj.get_superficie_display()
    get_superficie_display.short_description = 'Superficie'
    
    def get_color_codigo_display(self, obj):
        return obj.get_color_codigo_display()
    get_color_codigo_display.short_description = 'Estado'

@admin.register(Evolucion)
class EvolucionAdmin(admin.ModelAdmin):
    list_display = ('tratamiento', 'fecha', 'tiene_imagen')
    list_filter = ('fecha',)
    search_fields = ('tratamiento__paciente__nombre', 'tratamiento__paciente__apellido', 'descripcion')

    def tiene_imagen(self, obj):
        return bool(obj.imagen)
    tiene_imagen.boolean = True
    tiene_imagen.short_description = '¿Tiene Imagen?'