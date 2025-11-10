from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, CrontabSchedule
import json

class Command(BaseCommand):
    help = 'Configura la tarea periódica para envío de recordatorios'

    def handle(self, *args, **options):
        # Crear o obtener el schedule para ejecutar diariamente a las 8:00 AM
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute=0,
            hour=8,
            day_of_week='*',
            day_of_month='*',
            month_of_year='*',
        )

        # Crear o actualizar la tarea periódica
        task, created = PeriodicTask.objects.get_or_create(
            name='Programar recordatorios de turnos',
            defaults={
                'crontab': schedule,
                'task': 'pacientes.tasks.programar_recordatorios_diarios',
                'args': json.dumps([]),
                'kwargs': json.dumps({}),
                'enabled': True,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS('Tarea periódica creada exitosamente')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Tarea periódica ya existía')
            )