import React, { useState } from 'react';
import Calendar from 'react-calendar';
// Esta es la única importación de CSS necesaria para los estilos base del calendario
import 'react-calendar/dist/Calendar.css';

// DATOS DE EJEMPLO (en el futuro vendrán de tu backend)
const mockAppointments = [
  { date: '2025-10-20', time: '10:00 AM', patient: 'Ana Rodríguez' },
  { date: '2025-10-20', time: '11:30 AM', patient: 'Pedro Gómez' },
  { date: '2025-10-22', time: '02:00 PM', patient: 'Marta López' },
];

const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isHovering, setIsHovering] = useState(false);

  // --- Objeto de Estilos (traducción del archivo .css) ---
  const styles = {
    appointmentsContainer: {
      padding: '2rem',
      backgroundColor: '#f7fafc',
      minHeight: 'calc(100vh - 80px)',
      marginTop: '80px', // Espacio para la navbar fija
      boxSizing: 'border-box',
    },
    headerTitle: {
      fontSize: '2em',
      color: '#2d3748',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    contentLayout: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    calendarWrapper: {
      flex: '1',
      minWidth: '350px',
      maxWidth: '450px',
    },
    dailyAppointmentsWrapper: {
      flex: '1',
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      minWidth: '350px',
      maxWidth: '450px',
    },
    dailyHeader: {
      fontSize: '1.25em',
      color: '#4a5568',
      borderBottom: '2px solid #edf2f7',
      paddingBottom: '0.75rem',
      marginBottom: '1rem',
    },
    appointmentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxHeight: '400px',
      overflowY: 'auto',
      paddingRight: '10px',
    },
    appointmentCard: {
      backgroundColor: '#f7fafc',
      padding: '1rem',
      borderRadius: '0.375rem',
      borderLeft: '4px solid #4299e1',
    },
    cardParagraph: {
      margin: 0,
    },
    noAppointments: {
      color: '#718096',
      padding: '2rem 0',
      textAlign: 'center',
    },
    addAppointmentBtn: {
      width: '100%',
      marginTop: '1.5rem',
      padding: '0.75rem',
      fontSize: '1em',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#38a169',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    addAppointmentBtnHover: {
      backgroundColor: '#2f855a',
    },
  };

  const dailyAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.date);
    return appointmentDate.getFullYear() === selectedDate.getFullYear() &&
           appointmentDate.getMonth() === selectedDate.getMonth() &&
           appointmentDate.getDate() === selectedDate.getDate();
  });

  const handleAddAppointment = () => {
    alert(`Agregar nuevo turno para el día: ${selectedDate.toLocaleDateString()}`);
  };

  return (
    <div style={styles.appointmentsContainer}>
      <h2 style={styles.headerTitle}>Gestión de Turnos</h2>
      <div style={styles.contentLayout}>
        <div style={styles.calendarWrapper}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar" // La librería react-calendar necesita sus propias clases para funcionar bien
          />
        </div>
        <div style={styles.dailyAppointmentsWrapper}>
          <h3 style={styles.dailyHeader}>
            Turnos para el {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <div style={styles.appointmentsList}>
            {dailyAppointments.length > 0 ? (
              dailyAppointments.map((app, index) => (
                <div key={index} style={styles.appointmentCard}>
                  <p style={styles.cardParagraph}><strong>Horario:</strong> {app.time}</p>
                  <p style={styles.cardParagraph}><strong>Paciente:</strong> {app.patient}</p>
                </div>
              ))
            ) : (
              <p style={styles.noAppointments}>No hay turnos programados para este día.</p>
            )}
          </div>
          <button
            style={isHovering ? { ...styles.addAppointmentBtn, ...styles.addAppointmentBtnHover } : styles.addAppointmentBtn}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleAddAppointment}
          >
            + Agregar Nuevo Turno
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;