from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from datetime import datetime, timedelta
from .models import Turno
import logging

logger = logging.getLogger(__name__)

@shared_task
def enviar_recordatorio_turno(turno_id):
    """
    Envía un recordatorio por email para un turno específico
    """
    try:
        turno = Turno.objects.get(id=turno_id)
        
        # Verificar que el turno aún existe y no fue cancelado
        if not turno:
            logger.warning(f"Turno {turno_id} no encontrado, posiblemente fue cancelado")
            return False
            
        # Crear el contexto para el template del email
        contexto = {
            'paciente_nombre': f"{turno.paciente.nombre} {turno.paciente.apellido}",
            'fecha': turno.fecha.strftime("%d/%m/%Y"),
            'hora': turno.hora.strftime("%H:%M"),
            'motivo': turno.motivo,
            'odontologo': f"Dr. {turno.odontologo.nombre} {turno.odontologo.apellido}",
        }
        
        # Crear el contenido del email
        asunto = f"Recordatorio: Turno odontológico mañana a las {turno.hora.strftime('%H:%M')}"
        
        mensaje_html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0;">🦷 OdontoLeto</h1>
                    <h2 style="color: #374151; margin: 10px 0;">Recordatorio de Turno</h2>
                </div>
                
                <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #1e40af; margin-top: 0;">Estimado/a {contexto['paciente_nombre']},</h3>
                    <p style="color: #374151; line-height: 1.6;">
                        Le recordamos que tiene un turno programado para <strong>mañana {contexto['fecha']}</strong> a las <strong>{contexto['hora']}</strong>.
                    </p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #374151; margin-bottom: 15px;">📋 Detalles del turno:</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong>📅 Fecha:</strong> {contexto['fecha']}
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong>🕒 Hora:</strong> {contexto['hora']}
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong>👨‍⚕️ Odontólogo:</strong> {contexto['odontologo']}
                        </li>
                        <li style="padding: 8px 0;">
                            <strong>📝 Motivo:</strong> {contexto['motivo']}
                        </li>
                    </ul>
                </div>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #92400e;">
                        <strong>💡 Recomendaciones:</strong><br>
                        • Llegue 10 minutos antes de su turno<br>
                        • Traiga su documentación y carnet de obra social<br>
                        • Si no puede asistir, comuníquese con anticipación
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #6b7280; font-size: 14px;">
                        ¡Esperamos verle pronto!<br>
                        <strong>Equipo OdontoLeto</strong>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        mensaje_texto = f"""
        OdontoLeto - Recordatorio de Turno
        
        Estimado/a {contexto['paciente_nombre']},
        
        Le recordamos que tiene un turno programado para mañana {contexto['fecha']} a las {contexto['hora']}.
        
        Detalles del turno:
        - Fecha: {contexto['fecha']}
        - Hora: {contexto['hora']}
        - Odontólogo: {contexto['odontologo']}
        - Motivo: {contexto['motivo']}
        
        Recomendaciones:
        • Llegue 10 minutos antes de su turno
        • Traiga su documentación y carnet de obra social
        • Si no puede asistir, comuníquese con anticipación
        
        ¡Esperamos verle pronto!
        Equipo OdontoLeto
        """
        
        # Enviar el email
        send_mail(
            subject=asunto,
            message=mensaje_texto,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[turno.paciente.email],
            html_message=mensaje_html,
            fail_silently=False,
        )
        
        logger.info(f"Recordatorio enviado exitosamente para turno {turno_id} a {turno.paciente.email}")
        return True
        
    except Turno.DoesNotExist:
        logger.error(f"Turno {turno_id} no encontrado")
        return False
    except Exception as e:
        logger.error(f"Error enviando recordatorio para turno {turno_id}: {str(e)}")
        return False

@shared_task
def programar_recordatorios_diarios():
    """
    Tarea que se ejecuta diariamente para programar recordatorios de turnos
    del día siguiente 1 hora antes de cada turno
    """
    try:
        # Obtener turnos del día siguiente
        mañana = datetime.now().date() + timedelta(days=1)
        turnos_mañana = Turno.objects.filter(fecha=mañana)
        
        logger.info(f"Encontrados {turnos_mañana.count()} turnos para {mañana}")
        
        for turno in turnos_mañana:
            # Calcular cuándo enviar el recordatorio (1 hora antes)
            fecha_hora_turno = datetime.combine(turno.fecha, turno.hora)
            hora_recordatorio = fecha_hora_turno - timedelta(hours=1)
            
            # Solo programar si el recordatorio es en el futuro
            if hora_recordatorio > datetime.now():
                enviar_recordatorio_turno.apply_async(
                    args=[turno.id],
                    eta=hora_recordatorio
                )
                logger.info(f"Recordatorio programado para turno {turno.id} a las {hora_recordatorio}")
            else:
                logger.warning(f"No se programó recordatorio para turno {turno.id} - hora ya pasó")
                
        return f"Programados recordatorios para {turnos_mañana.count()} turnos"
        
    except Exception as e:
        logger.error(f"Error programando recordatorios diarios: {str(e)}")
        return f"Error: {str(e)}"