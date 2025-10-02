import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./App2.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  useEffect(() => {
    fetch("/data/pacientes.json")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error(err));
  }, []);

  // Lista de pacientes con barra de búsqueda
  const PacientesList = ({ pacientes, onSelect }) => {
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
              <li key={p.id} onClick={() => onSelect(p)}>
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

  return (
    <div className="App">
      {/* 
      <header>
        <h1> Seguidor de Ortodoncia</h1>
      </header>
      */}
      <main className="main-container">
        <PacientesList pacientes={pacientes} onSelect={setSelectedPaciente} />
        <PacienteDetail paciente={selectedPaciente} />
      </main>
    </div>
  );
}

export default App;
