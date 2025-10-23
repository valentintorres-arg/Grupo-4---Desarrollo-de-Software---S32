import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import AddAppointmentForm from '../components/turnos/AddAppointmentForm'

// Datos de ejemplo
const mockAppointments = [
  { id: 1, date: '2025-10-20', time: '10:00', patient: 'Ana Rodríguez', reason: 'Control mensual', duration: '30 min' },
  { id: 2, date: '2025-10-20', time: '11:30', patient: 'Pedro Gómez', reason: 'Consulta general', duration: '45 min' },
  { id: 3, date: '2025-10-22', time: '14:00', patient: 'Marta López', reason: 'Limpieza dental', duration: '60 min' },
]

const parseDurationToMinutes = (duration) => {
  if (duration.includes('hora')) {
    const hours = parseInt(duration.split(' ')[0]) || 1;
    return hours * 60;
  }
  const minutes = parseInt(duration.split(' ')[0]);
  return isNaN(minutes) ? 30 : minutes;
};


export const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState(mockAppointments)
  const [isHovering, setIsHovering] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState('day') // 'day' o 'all'

  const formatDate = (date) => date.toISOString().split('T')[0]
  const formatDisplayDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  const dailyAppointments = viewMode === 'day'
    ? appointments.filter(app => app.date === formatDate(selectedDate)).sort((a, b) => a.time.localeCompare(b.time))
    : appointments.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

const handleAddAppointment = (newApp) => {

  const newStartTime = new Date(`${newApp.date}T${newApp.time}`);
  const newDuration = parseDurationToMinutes(newApp.duration);
  const newEndTime = new Date(newStartTime.getTime() + newDuration * 60000);


  const appointmentsOnSameDay = appointments.filter(app => app.date === newApp.date);


  for (const existingApp of appointmentsOnSameDay) {
    const existingStartTime = new Date(`${existingApp.date}T${existingApp.time}`);
    const existingDuration = parseDurationToMinutes(existingApp.duration);
    const existingEndTime = new Date(existingStartTime.getTime() + existingDuration * 60000);
    const endHours = existingEndTime.getHours().toString().padStart(2, '0');
    const endMinutes = existingEndTime.getMinutes().toString().padStart(2, '0');
    const formattedEndTime = `${endHours}:${endMinutes}`;
    const isOverlapping = (newStartTime < existingEndTime) && (newEndTime > existingStartTime);

    if (isOverlapping) {

      alert(
        `Error: El horario se pisa con el turno de ${existingApp.patient} de ${existingApp.time} a ${formattedEndTime}.`
      );
      return false; 
    }
  }
  if (!newApp.id) newApp.id = Date.now();
  setAppointments(prev => [...prev, newApp]);
  return true; 
}

  // 🔹 BORRAR TURNO
  const handleDeleteAppointment = (id) => {
    if (window.confirm('¿Seguro que querés borrar este turno?')) {
      setAppointments(prev => prev.filter(app => app.id !== id))
    }
  }

  const styles = {
    appointmentsContainer: { padding: '2rem', backgroundColor: '#f7fafc', minHeight: '100vh', boxSizing: 'border-box' },
    headerTitle: { fontSize: '2em', color: '#2d3748', marginBottom: '1.5rem', textAlign: 'center' },
    contentLayout: { display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' },
    calendarWrapper: { flex: '1', minWidth: '350px', maxWidth: '450px' },
    dailyAppointmentsWrapper: { flex: '1', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '350px', maxWidth: '450px' },
    dailyHeader: { fontSize: '1.25em', color: '#4a5568', borderBottom: '2px solid #edf2f7', paddingBottom: '0.75rem', marginBottom: '1rem' },
    appointmentsList: { display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' },
    appointmentCard: { backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '0.375rem', borderLeft: '4px solid #4299e1', position: 'relative' },
    cardParagraph: { margin: '0.25rem 0' },
    deleteBtn: { position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.5rem', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', backgroundColor: '#e53e3e', color: 'white', fontWeight: 'bold', fontSize: '0.75em' },
    noAppointments: { color: '#718096', padding: '2rem 0', textAlign: 'center' },
    addAppointmentBtn: { width: '100%', marginTop: '1.5rem', padding: '0.75rem', fontSize: '1em', fontWeight: 'bold', color: 'white', backgroundColor: '#38a169', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' },
    addAppointmentBtnHover: { backgroundColor: '#2f855a' },
    viewModeBtn: { padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer', borderRadius: '0.25rem', border: '1px solid #cbd5e0', backgroundColor: '#edf2f7', fontWeight: 'bold' },
    activeViewMode: { backgroundColor: '#4299e1', color: 'white' },
  }

  const modalStyles = {
    overlay: { position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.4)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
    modal: { width:'400px', maxWidth:'90%', backgroundColor:'white', borderRadius:'0.5rem', padding:'1rem', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' },
  }

  const tileClassName = ({ date, view }) => {
    if(view==='month' && appointments.some(app => app.date === formatDate(date))) return 'has-appointment'
    return null
  }

  return (
    <div style={styles.appointmentsContainer}>
      <h2 style={styles.headerTitle}>Gestión de Turnos</h2>

      <div style={{ marginBottom:'1rem', textAlign:'center' }}>
        <button style={{ ...styles.viewModeBtn, ...(viewMode==='day'?styles.activeViewMode:{}) }} onClick={()=>setViewMode('day')}>Por Día</button>
        <button style={{ ...styles.viewModeBtn, ...(viewMode==='all'?styles.activeViewMode:{}) }} onClick={()=>setViewMode('all')}>Todos los Turnos</button>
      </div>

      <div style={styles.contentLayout}>
        <div style={styles.calendarWrapper}>
          <Calendar value={selectedDate} onChange={setSelectedDate} tileClassName={tileClassName} />
        </div>

        <div style={styles.dailyAppointmentsWrapper}>
          <h3 style={styles.dailyHeader}>
            {viewMode==='day' ? `Turnos para el ${selectedDate.toLocaleDateString('es-ES',{weekday:'long', year:'numeric', month:'long', day:'numeric'})}` : 'Todos los turnos'}
          </h3>

          <div style={styles.appointmentsList}>
            {dailyAppointments.length>0 ? (
              dailyAppointments.map(app=>(
                <div key={app.id || app.date+app.time} style={styles.appointmentCard}>
                  <p style={styles.cardParagraph}><strong>Paciente:</strong> {app.patient}</p>
                  <p style={styles.cardParagraph}><strong>Fecha:</strong> {formatDisplayDate(app.date)}</p>
                  <p style={styles.cardParagraph}><strong>Hora:</strong> {app.time}</p>
                  <p style={styles.cardParagraph}><strong>Duración:</strong> {app.duration}</p>
                  <p style={styles.cardParagraph}><strong>Motivo:</strong> {app.reason}</p>
                  <button style={styles.deleteBtn} onClick={()=>handleDeleteAppointment(app.id)}>Borrar</button>
                </div>
              ))
            ) : (
              <p style={styles.noAppointments}>No hay turnos programados.</p>
            )}
          </div>

          {!showForm && (
            <button
              style={isHovering?{...styles.addAppointmentBtn,...styles.addAppointmentBtnHover}:styles.addAppointmentBtn}
              onMouseEnter={()=>setIsHovering(true)}
              onMouseLeave={()=>setIsHovering(false)}
              onClick={()=>setShowForm(true)}
            >
              + Agregar Nuevo Turno
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div style={modalStyles.overlay} onClick={()=>setShowForm(false)}>
          <div style={modalStyles.modal} onClick={e=>e.stopPropagation()}>
            <AddAppointmentForm
              defaultDate={viewMode==='day'?formatDate(selectedDate):formatDate(new Date())}
              onAdd={handleAddAppointment}
              onClose={()=>setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentsPage
