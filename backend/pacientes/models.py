from django.db import models
from django.db.models import CASCADE

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
    fecha_nacimiento = models.DateField()
    email = models.EmailField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    numeroOS = models.CharField(max_length=50)
    obraSocial = models.ForeignKey(ObraSocial, on_delete=CASCADE)
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