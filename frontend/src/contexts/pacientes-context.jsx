// import { createContext, useContext, useState } from "react";
// import patientsData from "../data/pacientes.json";

// const PatientsContext = createContext();

// export function PatientsProvider({ children }) {
//   const [patients] = useState(patientsData);

//   const getPatientById = (id) => {
//     return patients.find((p) => p.id.toString() === id.toString());
//   };

//   const getAllPatients = () => patients;

//   return (
//     <PatientsContext.Provider value={{ patients, getPatientById, getAllPatients }}>
//       {children}
//     </PatientsContext.Provider>
//   );
// }

// export const usePatients = () => useContext(PatientsContext);


import { createContext, useContext, useState, useEffect } from "react";
import patientsData from "../data/pacientes.json";

const PatientsContext = createContext();

export function PatientsProvider({ children }) {
  // Inicializamos con pacientes del JSON o localStorage
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem("patients");
    return stored ? JSON.parse(stored) : patientsData;
  });

  // 💾 Guardar cambios en localStorage cuando se modifique la lista
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // ➕ Nueva función para agregar paciente
  const addPatient = (newPatient) => {
    const updated = [
      ...patients,
      { id: Date.now(), ...newPatient }, // id único
    ];
    setPatients(updated);
  };

  // 🔍 Obtener paciente por ID
  const getPatientById = (id) => {
    return patients.find((p) => p.id.toString() === id.toString());
  };

  // 📋 Obtener todos los pacientes
  const getAllPatients = () => patients;

  return (
    <PatientsContext.Provider
      value={{ patients, getPatientById, getAllPatients, addPatient }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export const usePatients = () => useContext(PatientsContext);