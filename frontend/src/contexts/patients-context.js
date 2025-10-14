import { createContext, useContext, useState } from "react";
import patientsData from "../data/pacientes.json";

const PatientsContext = createContext();

export function PatientsProvider({ children }) {
  const [patients] = useState(patientsData);

  const getPatientById = (id) => {
    return patients.find((p) => p.id.toString() === id.toString());
  };

  const getAllPatients = () => patients;

  return (
    <PatientsContext.Provider value={{ patients, getPatientById, getAllPatients }}>
      {children}
    </PatientsContext.Provider>
  );
}

export const usePatients = () => useContext(PatientsContext);
