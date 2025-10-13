import { useState, useEffect } from "react";
import { usePatients } from "../contexts/patients-context";
import { useNavigate } from "react-router-dom";

// Componentes modulares
import PatientList from "../components/pacientes/ListaPacientes";
import PatientDetail from "../components/pacientes/DetallePaciente";
import SearchBar from "../components/pacientes/Searchbar";

export default function PatientsPage() {
  const { getAllPatients } = usePatients();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setPatients(getAllPatients());
  }, [getAllPatients]);

  const filteredPatients = patients.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPatient = (p) => setSelectedPatient(p);
  const handleAddPatient = () => navigate("/patients/new");

  const styles = {
    pageContainer: "flex min-h-screen bg-gray-900 text-gray-100 p-4 gap-6",
    sidebar: "w-1/4 bg-gray-800 p-4 rounded shadow-lg",
    detailContainer: "flex-1 overflow-y-auto",
  };

  return (
    <div className={styles.pageContainer}>
      {/* Lista lateral */}
      <div className={styles.sidebar}>
        <SearchBar value={search} onChange={setSearch} onAdd={handleAddPatient} />
        <PatientList
          patients={filteredPatients}
          onSelect={handleSelectPatient}
          selectedId={selectedPatient?.id}
        />
      </div>

      {/* Detalle */}
      <div className={styles.detailContainer}>
        <PatientDetail patient={selectedPatient} />
      </div>
    </div>
  );
}
