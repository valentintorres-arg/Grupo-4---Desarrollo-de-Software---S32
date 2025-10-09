import React, { useState } from 'react';

// Datos de pacientes simulados (MOCK DATA)
// Esto será reemplazado por una llamada a la API de Django en el futuro
const MOCK_PATIENTS = [
  { id: 1, name: 'Ana Rodríguez' },
  { id: 2, name: 'Pedro Gómez' },
  { id: 3, name: 'Marta López' },
];

const RegisterTreatmentForm = () => {
  // 1. Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    patientId: '',
    startDate: '',
    treatmentType: '',
    initialDiagnosis: '',
    treatmentGoals: '',
    cost: '',
  });

  // 2. Función genérica para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 3. Función para manejar el envío (por ahora solo imprime los datos)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del tratamiento a enviar (Simulación sin Backend):', formData);
    alert('Formulario de tratamiento registrado (¡Falta implementar la conexión con Django!)');
    // En un futuro, aquí irá la llamada `fetch` o `axios` al backend
    // Ej: postTreatment(formData);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.header}>
        📝 Registrar Nuevo Tratamiento Ortodóntico
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Campo 1: Paciente */}
        <div style={styles.fieldGroup}>
          <label htmlFor="patientId" style={styles.label}>
            Paciente: <span style={styles.required}>*</span>
          </label>
          <select
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">-- Seleccione un paciente --</option>
            {MOCK_PATIENTS.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo 2: Tipo de Tratamiento */}
        <div style={styles.fieldGroup}>
          <label htmlFor="treatmentType" style={styles.label}>
            Tipo de Tratamiento: <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="treatmentType"
            name="treatmentType"
            value={formData.treatmentType}
            onChange={handleChange}
            placeholder="Ej: Brackets metálicos, Alineadores"
            required
            style={styles.input}
          />
        </div>

        {/* Campo 3: Fecha de Inicio */}
        <div style={styles.fieldGroup}>
          <label htmlFor="startDate" style={styles.label}>
            Fecha de Inicio: <span style={styles.required}>*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Campo 4: Diagnóstico Inicial */}
        <div style={styles.fieldGroup}>
          <label htmlFor="initialDiagnosis" style={styles.label}>
            Diagnóstico Inicial:
          </label>
          <textarea
            id="initialDiagnosis"
            name="initialDiagnosis"
            value={formData.initialDiagnosis}
            onChange={handleChange}
            rows="3"
            placeholder="Descripción concisa de la maloclusión y hallazgos."
            style={styles.textarea}
          />
        </div>

        {/* Campo 5: Objetivos del Tratamiento */}
        <div style={styles.fieldGroup}>
          <label htmlFor="treatmentGoals" style={styles.label}>
            Objetivos del Tratamiento:
          </label>
          <textarea
            id="treatmentGoals"
            name="treatmentGoals"
            value={formData.treatmentGoals}
            onChange={handleChange}
            rows="3"
            placeholder="Meta del tratamiento (ej: Clase I, alineación completa)."
            style={styles.textarea}
          />
        </div>
        
        {/* Campo 6: Costo (Opcional) */}
        <div style={styles.fieldGroup}>
          <label htmlFor="cost" style={styles.label}>
            Costo Total (Opcional):
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="1200.00"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Iniciar Seguimiento del Tratamiento
        </button>
      </form>
    </div>
  );
};

// Estilos básicos para simular la tarjeta (puedes usar CSS Modules o Styled Components)
const styles = {
  card: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    color: '#007bff',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  required: {
    color: 'red',
    marginLeft: '4px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
};

export default RegisterTreatmentForm;