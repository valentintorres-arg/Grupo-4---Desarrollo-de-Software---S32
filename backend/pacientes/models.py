from django.db import models
from django.db.models import CASCADE, SET_NULL
from django.contrib.auth.models import User


class ObraSocial(models.Model):
    nombre = models.CharField(max_length=55)
    cobertura = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        verbose_name_plural = "Obras Sociales"
    
    def __str__(self):
        return f"{self.nombre} ({self.id})"

class Paciente(models.Model):
    dni = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    edad = models.IntegerField()
    email = models.EmailField(max_length=255)
    numeroOS = models.CharField(max_length=50)  # Número de socio de la obra social
    obraSocial = models.ForeignKey(ObraSocial, on_delete=CASCADE)

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

class Especialidad(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Odontologo(models.Model):
    matricula = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    # almacenar hash salteado (ej. PBKDF2/argon2); no guardes contraseñas planas
    password_hash = models.CharField(max_length=256)
    especialidad = models.ForeignKey(Especialidad, on_delete=SET_NULL, null=True, blank=True, related_name='odontologos')

    def __str__(self):
        return f"{self.apellido}, {self.nombre} ({self.matricula})"


class Tratamiento(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('pausado', 'Pausado'),
        ('finalizado', 'Finalizado'),
    ]
    paciente = models.ForeignKey(Paciente, on_delete=CASCADE, related_name='tratamientos')
    odontologo = models.ForeignKey(Odontologo, on_delete=SET_NULL, null=True, blank=True, related_name='tratamientos')
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateField(auto_now_add=True)
    fecha_fin = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='activo')
    duracion_estimados = models.IntegerField(null=True, blank=True, help_text="Duración estimada en días (opcional)")

    def __str__(self):
        return f"{self.nombre} - {self.paciente} ({self.estado})"


class Practica(models.Model):
    codigo = models.CharField(max_length=40, unique=True)
    nombre = models.CharField(max_length=120)
    precio_base = models.FloatField()

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"


class ConsultaXPractica(models.Model):
    consulta = models.ForeignKey(Consulta, on_delete=CASCADE, related_name='consultas_practicas')
    practica = models.ForeignKey(Practica, on_delete=CASCADE, related_name='practicas_consultas')
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario_al_momento = models.FloatField()
    notas = models.TextField(blank=True)

    class Meta:
        unique_together = ('consulta', 'practica')

    def __str__(self):
        return f"Consulta {self.consulta_id} - {self.practica.codigo} x{self.cantidad}"


class UsoInsumo(models.Model):
    consulta = models.ForeignKey(Consulta, on_delete=CASCADE, related_name='usos_insumos')
    insumo = models.ForeignKey(Insumo, on_delete=CASCADE, related_name='usos')
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario_al_uso = models.FloatField(null=True, blank=True)  # autocompleta si no viene

    def save(self, *args, **kwargs):
        if self.precio_unitario_al_uso is None:
            self.precio_unitario_al_uso = self.insumo.precioUnitario
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Uso de Insumo"
        verbose_name_plural = "Usos de Insumo"

    def __str__(self):
        return f"Consulta {self.consulta_id} - {self.insumo.nombre} x{self.cantidad}"


class Comentario(models.Model):
    tratamiento = models.ForeignKey(Tratamiento, on_delete=CASCADE, related_name='comentarios')
    nota = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(Odontologo, on_delete=SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Comentario T{self.tratamiento_id} - {self.fecha:%Y-%m-%d}"


class ConsultaFoto(models.Model):
    """Varias fotos por consulta (Notion: URL puede ser varias fotos)."""
    consulta = models.ForeignKey(Consulta, on_delete=CASCADE, related_name='fotos')
    url = models.URLField(max_length=500)
    nota = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Foto C{self.consulta_id} - {self.url}"