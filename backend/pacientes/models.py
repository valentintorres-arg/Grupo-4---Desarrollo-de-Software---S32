from django.db import models
from django.db.models import CASCADE
from datetime import datetime, timedelta

class ObraSocial(models.Model):
    nombre = models.CharField(max_length=55)
    cobertura = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        verbose_name_plural = "Obras Sociales"
    
    def __str__(self):
        return f"{self.nombre} ({self.id})"

class Paciente(models.Model):
    GENERO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
        ('N', 'Prefiero no decir'),
    ]
    
    dni = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES)
    email = models.EmailField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    numeroOS = models.CharField(max_length=50)
    obraSocial = models.ForeignKey(ObraSocial, on_delete=CASCADE)
    
    # Datos de contacto de emergencia
    contacto_emergencia_nombre = models.CharField(max_length=255, blank=True, null=True)
    contacto_emergencia_relacion = models.CharField(max_length=100, blank=True, null=True)
    contacto_emergencia_telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.dni})"

class EntradaAntecedente(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=CASCADE, related_name='entradas_antecedentes')
    fecha = models.DateField()
    antecedente = models.TextField()

    def __str__(self):
        return f"{self.paciente} {self.fecha} {self.antecedente}"

class Antecedente(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=CASCADE)
    entradaAntecedente = models.ForeignKey(
        EntradaAntecedente,
        on_delete=CASCADE,
        related_name='antecedente_links',
        related_query_name='antecedente_link'
    )
    
    def __str__(self):
        return f"{self.paciente} {self.entradaAntecedente}"

class Consulta(models.Model):
    descripcion = models.TextField()
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.descripcion} {self.fecha}"

class Pago(models.Model):
    total = models.FloatField()
    fecha = models.DateField(auto_now_add=True)
    paciente = models.ForeignKey(Paciente, on_delete=CASCADE)
    consulta = models.ForeignKey(Consulta, on_delete=CASCADE)
    
    def __str__(self):
        return f"{self.total} {self.fecha} {self.paciente} {self.consulta}"

class Insumo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precioUnitario = models.FloatField()
    
    def __str__(self):
        return f"{self.nombre} {self.descripcion} {self.precioUnitario}"

class Turno(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()
    duracion = models.CharField(max_length=20)
    motivo = models.TextField()
    paciente = models.ForeignKey(Paciente, on_delete=CASCADE, related_name='turnos')
    odontologo = models.ForeignKey('odontologos.Odontologo', on_delete=CASCADE, related_name='turnos')
    recordatorio_programado = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Turnos"
        ordering = ['-fecha', '-hora']
        unique_together = ['fecha', 'hora', 'odontologo']
    
    def __str__(self):
        return f"Turno: {self.paciente} - {self.fecha} {self.hora} con Dr. {self.odontologo}"
    
    def save(self, *args, **kwargs):
        # Llamar al save original primero
        super().save(*args, **kwargs)
        
        # Programar recordatorio si es un turno nuevo y no se ha programado ya
        if not self.recordatorio_programado and self.fecha and self.hora:
            self.programar_recordatorio()
    
    def programar_recordatorio(self):
        """
        Programa un recordatorio para este turno 1 hora antes
        """
        try:
            from .tasks import enviar_recordatorio_turno
            
            # Combinar fecha y hora del turno
            fecha_hora_turno = datetime.combine(self.fecha, self.hora)
            
            # Calcular cuándo enviar el recordatorio (1 hora antes)
            hora_recordatorio = fecha_hora_turno - timedelta(hours=1)
            
            # Solo programar si el recordatorio es en el futuro
            if hora_recordatorio > datetime.now():
                # Programar la tarea
                enviar_recordatorio_turno.apply_async(
                    args=[self.id],
                    eta=hora_recordatorio
                )
                
                # Marcar como programado
                self.recordatorio_programado = True
                self.save(update_fields=['recordatorio_programado'])
                
                print(f"Recordatorio programado para turno {self.id} a las {hora_recordatorio}")
            else:
                print(f"No se programó recordatorio para turno {self.id} - hora ya pasó")
                
        except Exception as e:
            print(f"Error programando recordatorio para turno {self.id}: {str(e)}")
    
class EstadoTratamiento(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Estado de Tratamiento"
        verbose_name_plural = "Estados de Tratamiento"

class Tratamiento(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='tratamientos')
    estado = models.ForeignKey(EstadoTratamiento, on_delete=models.PROTECT, default=1)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)
    duracion_estimada = models.PositiveIntegerField(help_text="Duración estimada en meses")
    odontologo = models.ForeignKey('odontologos.Odontologo', on_delete=models.CASCADE, related_name='tratamientos')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.nombre} - {self.paciente.nombre} {self.paciente.apellido}"
    
    class Meta:
        verbose_name = "Tratamiento"
        verbose_name_plural = "Tratamientos"
        ordering = ['-created_at']

class Odontograma(models.Model):
    paciente = models.OneToOneField(Paciente, on_delete=models.CASCADE, related_name='odontograma')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Odontograma de {self.paciente.nombre} {self.paciente.apellido}"
    
    class Meta:
        verbose_name = "Odontograma"
        verbose_name_plural = "Odontogramas"

class OdontogramaDatos(models.Model):
    SUPERFICIE_CHOICES = [
        (1, 'Oclusal/Incisal'),
        (2, 'Mesial'),
        (3, 'Distal'), 
        (4, 'Vestibular'),
        (5, 'Lingual/Palatina')
    ]
    
    COLOR_CHOICES = [
        ('blanco', 'Sano'),
        ('rojo', 'Caries'),
        ('verde', 'Sellante'),
        ('gris', 'Amalgama'),
        ('azul', 'Composite'),
        ('negro', 'Extracción Indicada')
    ]
    
    odontograma = models.ForeignKey(Odontograma, on_delete=models.CASCADE, related_name='datos')
    fdi = models.IntegerField()  # Número FDI del diente (11-48)
    superficie = models.IntegerField(choices=SUPERFICIE_CHOICES)
    color_codigo = models.CharField(max_length=10, choices=COLOR_CHOICES, default='blanco')
    
    def __str__(self):
        return f"Diente {self.fdi} - Superficie {self.get_superficie_display()} - {self.get_color_codigo_display()}"
    
    class Meta:
        verbose_name = "Datos del Odontograma"
        verbose_name_plural = "Datos de Odontogramas"
        unique_together = ['odontograma', 'fdi', 'superficie']
        ordering = ['fdi', 'superficie']