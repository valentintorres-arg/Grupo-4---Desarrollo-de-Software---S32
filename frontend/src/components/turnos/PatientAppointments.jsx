import { useState, useEffect } from "react";
import { turnosAPI } from "../../services/api";
import { formatearFecha } from "../../utils/dateUtils";

export default function PatientAppointments({ pacienteId }) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTurnos = async () => {
      try {
        setLoading(true);
        setError(null);
        const turnosData = await turnosAPI.getByPatient(pacienteId);
        setTurnos(turnosData || []);
      } catch (err) {
        console.error('Error al cargar turnos:', err);
        setError('Error al cargar turnos: ' + err.message);
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      loadTurnos();
    }
  }, [pacienteId]);

  const handleDeleteTurno = async (id) => {
    if (window.confirm('¿Seguro que querés cancelar este turno?')) {
      try {
        await turnosAPI.delete(id);
        setTurnos(prev => prev.filter(turno => turno.id !== id));
      } catch (err) {
        console.error('Error al eliminar turno:', err);
        setError('Error al cancelar el turno: ' + err.message);
      }
    }
  };

  const getStatusColor = (fecha, hora) => {
    const now = new Date();
    const turnoDateTime = new Date(`${fecha}T${hora}`);
    
    if (turnoDateTime < now) {
      return '#6b7280'; // Gris para turnos pasados
    } else if (turnoDateTime.toDateString() === now.toDateString()) {
      return '#f59e0b'; // Amarillo para turnos de hoy
    } else {
      return '#10b981'; // Verde para turnos futuros
    }
  };

  const getStatusText = (fecha, hora) => {
    const now = new Date();
    const turnoDateTime = new Date(`${fecha}T${hora}`);
    
    if (turnoDateTime < now) {
      return 'Realizado';
    } else if (turnoDateTime.toDateString() === now.toDateString()) {
      return 'Hoy';
    } else {
      return 'Programado';
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    turnoCard: {
      background: "#fff",
      padding: "20px 60px 20px 20px", // Más padding a la derecha para el botón
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #e5e7eb",
      position: "relative",
    },
    turnoHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      marginRight: 80, // Espacio para el botón de cancelar
    },
    turnoDate: {
      fontSize: 16,
      fontWeight: 600,
      color: "#111827",
    },
    turnoTime: {
      fontSize: 14,
      color: "#6b7280",
      marginLeft: 8,
    },
    statusBadge: {
      padding: "4px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      color: "#fff",
    },
    turnoInfo: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
    },
    label: {
      fontWeight: 600,
      color: "#374151",
      minWidth: 80,
    },
    value: {
      color: "#6b7280",
    },
    deleteButton: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      zIndex: 10, // Para asegurar que esté por encima
      whiteSpace: "nowrap", // Evita que el texto se quiebre
      minWidth: "fit-content",
    },
    loading: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6b7280",
      fontSize: "1rem",
    },
    error: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "16px",
      color: "#dc2626",
      textAlign: "center",
      marginBottom: "16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6b7280",
      fontSize: "1rem",
      fontStyle: "italic",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#374151",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    icon: {
      fontSize: "1.2rem",
    },
  };

  if (loading) {
    return <div style={styles.loading}>Cargando turnos...</div>
  }

  return (
    <div>
      <h3 style={styles.sectionTitle}>
        <span style={styles.icon}>📅</span>
        Turnos del Paciente
      </h3>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.container}>
        {turnos.length === 0 ? (
          <div style={styles.emptyState}>
            No hay turnos programados para este paciente.
          </div>
        ) : (
          turnos
            .sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`)) // Más recientes primero
            .map((turno) => (
              <div key={turno.id} style={styles.turnoCard}>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteTurno(turno.id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                  title="Cancelar turno"
                >
                  Cancelar
                </button>

                <div style={styles.turnoHeader}>
                  <div>
                    <span style={styles.turnoDate}>
                      {formatearFecha(turno.fecha)}
                    </span>
                    <span style={styles.turnoTime}>
                      a las {turno.hora}
                    </span>
                  </div>
                  <div 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(turno.fecha, turno.hora)
                    }}
                  >
                    {getStatusText(turno.fecha, turno.hora)}
                  </div>
                </div>

                <div style={styles.turnoInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Odontólogo:</span>
                    <span style={styles.value}>
                      Dr. {turno.odontologo_nombre} {turno.odontologo_apellido}
                    </span>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Especialidad:</span>
                    <span style={styles.value}>
                      {turno.especialidad || 'No especificada'}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Duración:</span>
                    <span style={styles.value}>
                      {turno.duracion}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Motivo:</span>
                    <span style={styles.value}>
                      {turno.motivo}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Matrícula:</span>
                    <span style={styles.value}>
                      {turno.odontologo_matricula}
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}