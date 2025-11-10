import os
from celery import Celery

# Establecer el módulo de configuración predeterminado de Django para el programa 'celery'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orthodontics.settings')

app = Celery('orthodontics')

# Usar una cadena aquí significa que el trabajador no tiene que serializar
# el objeto de configuración a los procesos secundarios.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Cargar módulos de tareas de todas las aplicaciones Django registradas.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')