import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./App2.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 1. 🥇 IMPORTAR el nuevo componente de registro
import RegisterTreatmentForm from './components/RegisterTreatmentForm'; 
// Asegúrate de que la ruta './components/RegisterTreatmentForm' sea correcta.

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  
  // 2. 🥈 Nuevo estado para controlar la vista actual
  // Usaremos 'detail' (por defecto) o 'register'
  const [viewMode, setViewMode] = useState('detail'); 

  useEffect(() => {
    fetch("/data/pacientes.json")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error(err));
  }, []);
  
  // Función para cambiar de vista y limpiar paciente seleccionado si vamos a registrar
  const handleRegisterClick = () => {
      setSelectedPaciente(null); // Opcional: limpiar la selección al registrar
      setViewMode('register');
  }

  // Función para seleccionar paciente y volver a la vista de detalle
  const handleSelectPatient = (paciente) => {
      setSelectedPaciente(paciente);
      setViewMode('detail');
  }


  // --- COMPONENTES INTERNOS (PacientesList, ConsultasList, etc.) ---
  
  // MODIFICAMOS PacientesList para tener un botón de "Registrar"
  const PacientesList = ({ pacientes, onSelect, onRegisterNew }) => {
    const [search, setSearch] = useState("");

    const filteredPacientes = pacientes.filter((p) =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="pacientes-list">
        <h2>Pacientes</h2>
        
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {/* Agregamos un botón para cambiar a la vista de registro */}
        <button className="btn-add" onClick={onRegisterNew}>Registrar Tratamiento</button>
        <button className="btn-delete">-</button>
        <ul>
          {filteredPacientes.length > 0 ? (
            filteredPacientes.map((p) => (
              // Usamos la nueva función handleSelectPatient
              <li key={p.id} onClick={() => onSelect(p)} className={p.id === selectedPaciente?.id ? 'selected' : ''}>
                {p.nombre} {p.apellido}
              </li>
            ))
          ) : (
            <li className="empty">No se encontró ningún paciente</li>
          )}
        </ul>
      </div>
    );
  };
  
  // ... (El resto de tus componentes internos ConsultasList, ConsultaCarousel, PacienteDetail quedan igual) ...
  const ConsultasList = ({ consultas }) => { /* ... */ };
  const ConsultaCarousel = ({ consultas }) => { /* ... */ };
  const PacienteDetail = ({ paciente }) => { 
    if (!paciente)
      return <div className="empty">Selecciona un paciente para ver detalles</div>;

    return (
      <div className="paciente-detail">
        <h2>{paciente.nombre} {paciente.apellido}</h2>
        {paciente.tratamientos.map((t) => (
          <div key={t.id} className="tratamiento">
            <h3>{t.nombre}</h3>
            <ConsultasList consultas={t.consultas} />
            <ConsultaCarousel consultas={t.consultas} />
          </div>
        ))}
      </div>
    );
  };


  // --- RENDERIZADO PRINCIPAL (RETURN) ---
  return (
    <div className="App">
      {/* ... header opcional ... */}
      <main className="main-container">
        {/* Pasamos la nueva función handleSelectPatient y handleRegisterClick */}
        <PacientesList 
            pacientes={pacientes} 
            onSelect={handleSelectPatient} 
            onRegisterNew={handleRegisterClick}
        />
        
        {/* 3. 🥉 Lógica condicional para mostrar la vista principal o el formulario de registro */}
        <div className="detail-area">
            {viewMode === 'detail' && (
                <PacienteDetail paciente={selectedPaciente} />
            )}
            
            {viewMode === 'register' && (
                <RegisterTreatmentForm 
                    patients={pacientes} // Le pasamos la lista de pacientes para el selector
                    onSuccess={() => setViewMode('detail')} // Opcional: Volver a detail tras un registro exitoso
                />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;