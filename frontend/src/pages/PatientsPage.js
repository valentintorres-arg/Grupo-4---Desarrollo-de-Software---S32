import { useState } from "react"
import HeaderP from "../components/pacientes/headerp"
import Carrousel from "../components/pacientes/carrousel"
import PersonalInfo from "../components/pacientes/informacion"
import Odontograma from "../components/pacientes/Odontograma"
import Antecedentes from "../components/pacientes/Antecedentes"
import Turnos from "../components/pacientes/Turnos"

import "../components/pacientes/CartaPaciente.css"

export default function PatientProfile() {
  const [patientData, setPatientData] = useState({
    id: "000001",
    nombre: "Jonathan",
    apellido: "Santurio",
    fechaNacimiento: "2000-02-03",
    telefono: "+54 221 98989898",
    email: "elño@gmail.com",
    obraSocial: "Armada",
    genero: "Masculino",
    dni: "9797979797",
  })

  const [activeSection, setActiveSection] = useState("personal")

  const handleFieldUpdate = (field, value) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="contenedor-perfil-paciente">
      <div className="contenedor-flecha">
        <div className="boton-flecha">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icono-flecha"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Volver</span>
        </div>
      </div>

      <HeaderP
        nombre={patientData.nombre}
        apellido={patientData.apellido}
        edad={calculateAge(patientData.fechaNacimiento)}
        genero={patientData.genero}
      />

      <Carrousel activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="contenido-seccion">
        {activeSection === "personal" && (
          <PersonalInfo patientData={patientData} onFieldUpdate={handleFieldUpdate} />
        )}
        {activeSection === "odontograma" && <Odontograma />}
        {activeSection === "antecedentes" && <Antecedentes />}
        {activeSection === "Turnos" && <Turnos />}
      </div>
    </div>
  )
}