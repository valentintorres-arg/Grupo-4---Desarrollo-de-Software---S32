import React, { useState, useEffect } from 'react'
import { patientsAPI } from '../../services/api'

const AddAppointmentForm = ({ defaultDate, onAdd, onClose }) => {
  const [pacientes, setPacientes] = useState([])
  const [filteredPacientes, setFilteredPacientes] = useState([])
  const [selectedPaciente, setSelectedPaciente] = useState('')
  const [searchDni, setSearchDni] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState('09:00')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('30 min')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Solo cargar pacientes
      const pacientesData = await patientsAPI.getAll()
      setPacientes(pacientesData)
      setFilteredPacientes(pacientesData)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('Error al cargar pacientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para filtrar pacientes por DNI
  const handleSearchDni = (value) => {
    setSearchDni(value)
    if (value.trim() === '') {
      setFilteredPacientes(pacientes)
      setShowDropdown(false)
    } else {
      const filtered = pacientes.filter(p => 
        p.dni.toString().includes(value) || 
        `${p.nombre} ${p.apellido}`.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredPacientes(filtered)
      setShowDropdown(true)
    }
  }

  // Función para seleccionar un paciente
  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente.id.toString())
    setSearchDni(`${paciente.dni} - ${paciente.nombre} ${paciente.apellido}`)
    setShowDropdown(false)
  }

  // Función para limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchDni('')
    setSelectedPaciente('')
    setFilteredPacientes(pacientes)
    setShowDropdown(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!selectedPaciente || !time || !reason) {
      alert('Por favor completá todos los campos.')
      return
    }

    // Validar horario
    const selectedTime = new Date(`2000-01-01T${time}`);
    const minTime = new Date(`2000-01-01T08:00`);
    const maxTime = new Date(`2000-01-01T18:00`);
    
    if (selectedTime < minTime || selectedTime > maxTime) {
      alert('El horario debe estar entre las 8:00 y las 18:00 horas.')
      return
    }

    // Validar fecha
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('No se pueden crear turnos en fechas pasadas.')
      return
    }

    const pacienteObj = pacientes.find((p) => p.id === parseInt(selectedPaciente))
    
    if (!pacienteObj) {
      alert('Error: Paciente no encontrado.')
      return
    }

    const nuevoTurno = {
      date,
      time,
      duration,
      reason,
      pacienteId: pacienteObj.id,
      // El odontólogo se asigna automáticamente en el backend
      patient: `${pacienteObj.nombre} ${pacienteObj.apellido}`
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
    loading: {
      textAlign: 'center',
      padding: '2rem',
      color: '#6b7280'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '1rem',
      color: '#dc2626',
      marginBottom: '1rem'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '0.5rem'
    },
    searchInput: {
      width: '100%',
      padding: '0.5rem',
      paddingRight: '2.5rem',
      borderRadius: '0.25rem',
      border: '1px solid #cbd5e0',
      fontSize: '0.95em',
    },
    clearButton: {
      position: 'absolute',
      right: '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '1.2rem'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #cbd5e0',
      borderTop: 'none',
      borderRadius: '0 0 0.25rem 0.25rem',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    dropdownItem: {
      padding: '0.75rem',
      cursor: 'pointer',
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s'
    },
    dropdownItemHover: {
      backgroundColor: '#f8fafc'
    }
  }

  if (loading) {
    return (
      <div style={styles.formWrapper}>
        <div style={styles.loading}>Cargando datos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.formWrapper}>
        <div style={styles.error}>{error}</div>
        <button
          style={{ ...styles.button, ...styles.cancelBtn }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <div style={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Buscar Paciente (por DNI o nombre)</label>
          <div style={styles.searchContainer} className="search-container">
            <input
              type="text"
              value={searchDni}
              onChange={(e) => handleSearchDni(e.target.value)}
              placeholder="Escribí el DNI o nombre del paciente..."
              style={styles.searchInput}
              onFocus={() => searchDni && setShowDropdown(true)}
            />
            {searchDni && (
              <button
                type="button"
                style={styles.clearButton}
                onClick={handleClearSearch}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
            {showDropdown && filteredPacientes.length > 0 && (
              <div style={styles.dropdown}>
                {filteredPacientes.map((p) => (
                  <div
                    key={p.id}
                    style={styles.dropdownItem}
                    onClick={() => handleSelectPaciente(p)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: 'bold' }}>
                      DNI: {p.dni} - {p.nombre} {p.apellido}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      Email: {p.email || 'No especificado'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showDropdown && filteredPacientes.length === 0 && searchDni && (
              <div style={styles.dropdown}>
                <div style={{ ...styles.dropdownItem, color: '#6b7280', fontStyle: 'italic' }}>
                  No se encontraron pacientes con ese DNI o nombre
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label style={styles.label}>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label style={styles.label}>Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
            min="08:00"
            max="18:00"
            step="900"
          />
          <small style={{ color: '#6b7280', fontSize: '0.8em' }}>
            Horario de atención: 8:00 - 18:00 horas
          </small>
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
