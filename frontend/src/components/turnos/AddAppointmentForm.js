import React, { useState, useEffect } from 'react'
import pacientesData from '../../data/pacientes.json'

const AddAppointmentForm = ({ defaultDate, onAdd, onClose }) => {
  const [pacientes, setPacientes] = useState([])
  const [selectedPaciente, setSelectedPaciente] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState('09:00')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('30 min')

  useEffect(() => {
    setPacientes(pacientesData)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedPaciente || !time || !reason) {
      alert('Por favor completá todos los campos.')
      return
    }

    const pacienteObj = pacientes.find((p) => p.id === parseInt(selectedPaciente))
    const nombreCompleto = `${pacienteObj.nombre} ${pacienteObj.apellido}`

    const nuevoTurno = {
      id: Date.now(),
      pacienteId: pacienteObj.id,
      patient: nombreCompleto,
      email: pacienteObj.email,
      date,
      time,
      duration,
      reason,
    }
    const success = onAdd(nuevoTurno); 
    if (success) {
      onClose();
    }
  }

  const styles = {
    formWrapper: {
      backgroundColor: '#f7fafc',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      marginTop: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      marginBottom: '0.5rem',
      borderRadius: '0.25rem',
      border: '1px solid #cbd5e0',
      fontSize: '0.95em',
    },
    label: {
      fontWeight: 'bold',
      color: '#2d3748',
      display: 'block',
      marginBottom: '0.25rem',
    },
    button: {
      padding: '0.5rem 1rem',
      marginRight: '0.5rem',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    addBtn: { backgroundColor: '#38a169', color: 'white' },
    cancelBtn: { backgroundColor: '#e2e8f0' },
  }

  return (
    <div style={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Paciente</label>
          <select
            value={selectedPaciente}
            onChange={(e) => setSelectedPaciente(e.target.value)}
            style={styles.input}
          >
            <option value="">Seleccionar paciente...</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Duración</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
          >
            <option>15 min</option>
            <option>30 min</option>
            <option>45 min</option>
            <option>1 hora</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Motivo</label>
          <input
            type="text"
            placeholder="Ej: control mensual, limpieza..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.input}
          />
        </div>

        <div>
          <button type="submit" style={{ ...styles.button, ...styles.addBtn }}>
            Agregar Turno
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.cancelBtn }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAppointmentForm
