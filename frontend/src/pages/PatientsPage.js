import { useState, useEffect } from "react";
import Slider from "react-slick";
import { usePatients } from "../contexts/patients-context";
import { useNavigate } from "react-router-dom"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PatientsPage() {
  const { getAllPatients } = usePatients();
  const patientsData = getAllPatients() || [];
  const navigate = useNavigate(); // <-- hook de navegación

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => setPatients(patientsData), [patientsData]);

  const filteredPatients = patients.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPatient = (patient) => setSelectedPatient(patient);

  // Función para ir a la página de Nuevo Paciente
const handleAddPatient = () => navigate("/patients/new");


  const ConsultasList = ({ consultas }) =>
    !consultas?.length ? (
      <p className="text-gray-400 mt-2">No hay consultas registradas.</p>
    ) : (
      <div className="space-y-3 mt-2">
        {consultas.map((c) => (
          <div key={c.id} className="p-3 border rounded shadow-sm bg-gray-700 text-gray-100">
            <p><strong>Fecha:</strong> {c.fecha}</p>
            <p><strong>Lugar:</strong> {c.lugar}</p>
            <p><strong>Descripción:</strong> {c.descripcion}</p>
            <p><strong>Monto:</strong> ${c.monto} ({c.detalle})</p>
          </div>
        ))}
      </div>
    );

  const ConsultaCarousel = ({ consultas }) => {
    if (!consultas?.length) return null;

    const settings = { dots: true, infinite: false, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Evolución del tratamiento</h3>
        <Slider {...settings}>
          {consultas.map((c, idx) => (
            <div key={idx} className="flex flex-col items-center p-2">
              {c.imagen && <img src={c.imagen} alt={`Consulta ${c.id}`} className="rounded shadow-md" />}
              <p className="mt-2 text-gray-300">{c.fecha}</p>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const PatientDetail = ({ patient }) => {
    if (!patient) return <p className="text-gray-400 mt-2">Selecciona un paciente para ver detalles</p>;
    const tratamientos = patient.tratamientos || [];

    return (
      <div className="mt-4 space-y-6">
        <h2 className="text-xl font-bold text-gray-100">{patient.nombre} {patient.apellido}</h2>
        {tratamientos.length === 0 ? (
          <p className="text-gray-400">Este paciente no tiene tratamientos registrados.</p>
        ) : tratamientos.map((t) => (
          <div key={t.id} className="border p-4 rounded shadow-sm bg-gray-800 text-gray-100">
            <h3 className="text-lg font-semibold">{t.nombre}</h3>
            <ConsultasList consultas={t.consultas} />
            <ConsultaCarousel consultas={t.consultas} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 p-4 gap-6">
      {/* Lista de pacientes */}
      <div className="w-1/4 flex flex-col gap-4 bg-gray-800 p-4 rounded shadow-lg">
        <h3 className="font-semibold text-gray-200">Pacientes</h3>
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded text-gray-900"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddPatient} // <-- redirige a new-patient
            className="bg-blue-600 px-2 py-1 rounded"
          >
            +
          </button>
          <button className="bg-red-600 px-2 py-1 rounded">-</button>
        </div>
        <ul className="space-y-2 overflow-y-auto">
          {filteredPatients.map((p) => (
            <li
              key={p.id}
              onClick={() => handleSelectPatient(p)}
              className={`cursor-pointer p-2 rounded hover:bg-blue-600 ${
                selectedPatient?.id === p.id ? "bg-blue-700 border-l-4 border-blue-400" : ""
              }`}
            >
              {p.nombre} {p.apellido}
            </li>
          ))}
        </ul>
      </div>

      {/* Detalle paciente */}
      <div className="flex-1 overflow-y-auto">
        <PatientDetail patient={selectedPatient} />
      </div>
    </div>
  );
}
