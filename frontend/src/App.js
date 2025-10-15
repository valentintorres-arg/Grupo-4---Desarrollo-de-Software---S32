import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage"
import PatientDetailPage from "./pages/PatientsPage"
import RegisterTreatmentPage from "./pages/RegisterTreatmentPage";
import NewPatientPage from "./pages/NewPatientsPage";
import LoginPage from "./pages/LoginPage";
import PatientsList from "./pages/PatientsList";

import { PatientsProvider } from "./contexts/patients-context";

function App() {
  return (
    <PatientsProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/patients" element={<PatientsPage />} /> */}
          <Route path="/patients" element={<PatientsList />} />

          <Route path="/patients/new" element={<NewPatientPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/register" element={<RegisterTreatmentPage />} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </Router>
    </PatientsProvider>
  );
}

export default App;
