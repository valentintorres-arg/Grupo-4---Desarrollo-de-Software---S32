import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import PatientDetailPage from "./pages/Pacientes"
import RegisterTreatmentPage from "./components/tratamiento/tratamientos"
import NewPatientPage from "./components/pacientes/nuevo-paciente";
import LoginPage from "./pages/Login";
import PatientsList from "./components/pacientes/listado-pacientes";
import AppointmentsPage from "./pages/Turnos";
import Antecedentes from "./components/pacientes/antecedentes";

import { PatientsProvider } from "./contexts/pacientes-context";

function App() {
  return (
    <PatientsProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/new" element={<NewPatientPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/register" element={<RegisterTreatmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/antecedentes" element={<Antecedentes />} />
        </Routes>
      </Router>
    </PatientsProvider>
  );
}

export default App;
