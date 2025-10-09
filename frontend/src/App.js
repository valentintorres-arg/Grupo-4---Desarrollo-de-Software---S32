import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./App2.css"; 

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🥇 Nuevas Importaciones
import Home from './components/Home';
import Navbar from './components/Navbar';
import RegisterTreatmentForm from './components/RegisterTreatmentForm'; 

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  
  // 🥈 CAMBIO CLAVE: Inicializar viewMode a 'home'
  const [viewMode, setViewMode] = useState('home'); // 'home', 'detail', o 'register'

  useEffect(() => {
    // 💡 TU LÓGICA DE FETCH VA AQUÍ
    fetch("/data/pacientes.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Error al cargar pacientes:", err));
  }, []);

  const handleSelectPatient = (paciente) => {
      setSelectedPaciente(paciente);
      setViewMode('detail');
  }
  
  // Función central para cambiar de vista
  const handleViewChange = (newView) => {
      // Opcional: limpiar la selección si vamos a la vista de registro
      if (newView === 'register') {
          setSelectedPaciente(null); 
      }
      setViewMode(newView);
  }


  // --- 🥉 TUS COMPONENTES INTERNOS DEBEN IR AQUÍ (PacientesList, ConsultasList, etc.) ---
  
  // ASEGÚRATE DE COPIAR Y PEGAR AQUÍ ABAJO TUS DEFINICIONES ORIGINALES Y COMPLETAS:
  
  const PacientesList = ({ pacientes, onSelect }) => { 
    // ... Código completo de tu PacientesList
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
        <button className="btn-add">+</button>
        <button className="btn-delete">-</button>
        <ul>
          {filteredPacientes.length > 0 ? (
            filteredPacientes.map((p) => (
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

  const ConsultasList = ({ consultas }) => {
    if (!consultas || consultas.length === 0)
      return <p className="empty">No hay consultas registradas.</p>;

    return (
      <div className="consultas-list">
        <h3>Consultas</h3>
        <button className="btn-add">+</button>
        <button className="btn-delete">-</button>
        {consultas.map((c) => (
          <div key={c.id} className="consulta-card">
            <p><strong>Fecha:</strong> {c.fecha}</p>
            <p><strong>Lugar:</strong> {c.lugar}</p>
            <p><strong>Descripción:</strong> {c.descripcion}</p>
            <p><strong>Monto:</strong> ${c.monto} ({c.detalle})</p>
          </div>
        ))}
      </div>
    );
  };

  const ConsultaCarousel = ({ consultas }) => {
    if (!consultas || consultas.length === 0)
      return <p className="empty">No hay imágenes para mostrar.</p>;

    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="carousel-container">

        <h3>Evolución del tratamiento</h3>
        <Slider {...settings}>
          {consultas.map((c) => (
            <div key={c.id} className="carousel-slide">
              <img src={c.imagen} alt={`Consulta ${c.id}`} />
              <p>{c.fecha}</p>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

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
  
  // --- FIN DE TUS COMPONENTES INTERNOS ---


  // --- RENDERIZADO PRINCIPAL (RETURN) ---
  return (
    <div className="App">
      
      <Navbar onViewChange={handleViewChange} currentView={viewMode} />
      
      <main className="main-container">
        {/* RENDERIZADO DE HOME: Se muestra si viewMode es 'home' */}
        {viewMode === 'home' && (
            <Home />
        )}

        {/* RENDERIZADO DE PACIENTES/DETALLE: Se muestra si viewMode es 'detail' */}
        {viewMode === 'detail' && (
            <> 
                {/* PacientesList y su detalle se muestran juntos */}
                <PacientesList pacientes={pacientes} onSelect={handleSelectPatient} />
                <div className="content-area">
                    <PacienteDetail paciente={selectedPaciente} />
                </div>
            </>
        )}
        
        {/* RENDERIZADO DE REGISTRAR TRATAMIENTO: Se muestra si viewMode es 'register' */}
        {viewMode === 'register' && (
            // Usamos un div que ocupa todo el ancho del main-container para el formulario
            <div className="content-area full-width">
                <RegisterTreatmentForm 
                    patients={pacientes} 
                    onSuccess={() => handleViewChange('detail')} // Vuelve a la vista de pacientes tras éxito
                />
            </div>
        )}
      </main>
    </div>
  );
}

export default App;