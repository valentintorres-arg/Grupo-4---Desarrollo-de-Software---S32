# Sistema de Recordatorios por Email

## Configuración Inicial

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Instalar y configurar Redis con Docker
```bash
# Descargar e instalar imagen de Redis
docker pull redis:alpine

# Crear y ejecutar contenedor Redis
docker run --name redis-odontoleto -p 6379:6379 -d redis:alpine

# Verificar que está corriendo
docker ps
```

**Comandos útiles para Redis:**
```bash
# Iniciar contenedor (si está detenido)
docker start redis-odontoleto

# Detener contenedor
docker stop redis-odontoleto

# Ver logs de Redis
docker logs redis-odontoleto

# Conectar a Redis CLI
docker exec -it redis-odontoleto redis-cli
```

### 3. Configurar Email en settings.py
Editar las siguientes líneas en `orthodontics/settings.py`:

```python
EMAIL_HOST_USER = 'tu_email@gmail.com'  # Tu email real
EMAIL_HOST_PASSWORD = 'tu_password_de_aplicacion'  # Password de aplicación de Gmail
DEFAULT_FROM_EMAIL = 'OdontoLeto <tu_email@gmail.com>'
```

**Para Gmail:**
1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Verificación en 2 pasos (activar si no está)
3. Contraseñas de aplicaciones → Crear nueva
4. Usar esa contraseña en EMAIL_HOST_PASSWORD

### 4. Ejecutar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Configurar tarea periódica
```bash
python manage.py setup_reminders
```

## Ejecutar el Sistema

### 1. Iniciar Redis con Docker
```bash
# Iniciar contenedor Redis (si no está corriendo)
docker start redis-odontoleto

# Verificar que está activo
docker ps | grep redis-odontoleto
```

### 2. Iniciar Django
```bash
python manage.py runserver
```

### 3. Iniciar Celery Worker (en nueva terminal)
```bash
celery -A orthodontics worker --loglevel=info
```

### 4. Iniciar Celery Beat (en nueva terminal)
```bash
celery -A orthodontics beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## Cómo Funciona

1. **Cuando se crea un turno**: Automáticamente se programa un recordatorio 1 hora antes
2. **Recordatorio diario**: A las 8:00 AM se revisan los turnos del día siguiente y se programan recordatorios
3. **Email automático**: 1 hora antes del turno se envía un email al paciente

## Contenido del Email

El email incluye:
- Saludo personalizado
- Fecha y hora del turno
- Nombre del odontólogo
- Motivo de la consulta
- Recomendaciones útiles
- Formato HTML profesional

## Logs y Debugging

Para ver los logs de Celery:
```bash
# Ver trabajadores activos
celery -A orthodontics inspect active

# Ver tareas programadas
celery -A orthodontics inspect scheduled

# Purgar todas las tareas
celery -A orthodontics purge
```

## Troubleshooting

### Error de conexión a Redis
- Verificar que el contenedor Docker esté corriendo: `docker ps | grep redis-odontoleto`
- Iniciar contenedor si está detenido: `docker start redis-odontoleto`
- Verificar logs del contenedor: `docker logs redis-odontoleto`
- Comprobar la URL en CELERY_BROKER_URL (debe ser `redis://localhost:6379/0`)

### Emails no se envían
- Verificar configuración de EMAIL_* en settings.py
- Comprobar que la contraseña de aplicación sea correcta
- Verificar logs de Celery Worker

### Tareas no se ejecutan
- Verificar que Celery Beat esté ejecutándose
- Comprobar que la tarea periódica esté creada en el admin
- Revisar zona horaria en CELERY_TIMEZONE

### Prueba del mensaje

# 1. Buscar el turno para Hotmail
from pacientes.models import Turno
try:
    turno_hotmail = Turno.objects.get(paciente__email='thomisz@hotmail.com.ar')
    print(f"✅ Turno encontrado: ID {turno_hotmail.id}")
    print(f"📧 Para: {turno_hotmail.paciente.email}")
    print(f"📅 Fecha: {turno_hotmail.fecha} - {turno_hotmail.hora}")
except Turno.DoesNotExist:
    print("❌ Turno no encontrado")

# 2. Enviar recordatorio REAL
from pacientes.tasks import enviar_recordatorio_turno

print("\n🎯 ENVIANDO EMAIL REAL...")
print(f"📤 Desde: {settings.EMAIL_HOST_USER}")
print(f"📧 Para: thomisz@hotmail.com.ar")

try:
    resultado = enviar_recordatorio_turno(turno_hotmail.id)
    print(f"\nResultado: {resultado}")
    
    if resultado:
        print("🎉 ¡EMAIL ENVIADO EXITOSAMENTE!")
        print("📱 Revisa tu bandeja de entrada de Hotmail")
        print("⏰ Puede tardar 1-3 minutos en llegar")
        print("📁 Si no aparece, revisa SPAM/Correo no deseado")
    else:
        print("❌ Error en el envío")
        
except Exception as e:
    print(f"❌ Error: {e}")
