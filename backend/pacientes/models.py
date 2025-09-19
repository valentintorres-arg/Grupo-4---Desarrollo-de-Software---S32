from django.db import models
from django.db.models import CASCADE

# Create your models here.
class ObraSocial(models.Model):
    idObraSocial = models.IntegerField(primary_key=True, unique=True)
    nombre = models.CharField(max_lenght=55)
    cobertura = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"{self.nombre} {self.cobertura} {self.idObraSocial}"
    
class Antecedente(models.Model):
    dni = models.ForeignKey(Paciente, on_delete=CASCADE)
    entradaAntecedenteID = models.ForeignKey(EntradaAntecedente, on_delete=CASCADE)
    
    def __str__ (self):
        return f"{self.dni} {self.entradaAntecedenteID}"
    
class Paciente(models.Model):
    dni = models.IntegerField(primary_key=True, unique=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    edad = models.IntegerField()
    email = models.CharField(max_length=255)
    numeroOS = models.IntegerField(unique=True)
    idObraSocial = models.ForeignKey(ObraSocial, on_delete=CASCADE)

    def __str__(self):
        return f"{self.nombre} {self.apellido} {self.dni}"

class EntradaAntecedente(models.Model):
    entradaAntecedenteID = models.IntegerField(primary_key=True, unique=True)
    fecha = models.DateField()
    antecedente = models.TextField()

    def __str__(self):
        return f"{self.paciente} {self.fecha} {self.antecedente} {self.entradaAntecedenteID}"
class Pago(models.Model):
    idPago = models.IntegerField(primary_key=True, unique=True)
    total = models.FloatField(max_length=10)
    fecha = models.DateField(auto_now_add=True)
    pacienteId = models.ForeignKey(Paciente, on_delete=CASCADE)
    consultaId = models.ForeignKey(Consulta, on_delete=CASCADE)
    
    def __str__(self):
        return f"{self.idPago} {self.total} {self.fecha} {self.pacienteId} {self.consultaId}"
    
class Consulta(models.Model):
    idConsulta = models.IntegerField(primary_key=True, unique=True)
    descripcion = models.TextField()
    fecha = models.DateField(auto_now_add=True)
    
    
    
    
class Insumo(models.Model):
    idInsumo = models.IntegerField(primary_key=True, unique=True)
    nombre = models.CharField(max_lenght=100)
    descripcion = models.TextField()
    precioUnitario = models.FloatField(max_length=10)
    
    def __str__(self):
        return f"{self.idInsumo} {self.nombre} {self.descripcion} {self.precioUnitario}"