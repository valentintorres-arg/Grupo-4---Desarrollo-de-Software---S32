import { useState, useEffect } from "react";
import { patientsAPI, obrasSocialesAPI } from "../services/api";

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [obrasSociales, setObrasSociales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadPatients = async () => {
        try {
        setLoading(true);
        setError(null);
        const data = await patientsAPI.getAll();
        setPatients(data);
        } catch(err) {
            setError('Error al cargar pacientes: ' + err.message);
        } finally {
            setLoading(false);
        }
    }
    
    const loadObrasSociales = async () => {
        try {
            const data = await obrasSocialesAPI.getAll();
            setObrasSociales(data);
        } catch (err) {
            setError('Error al cargar obras sociales: ' + err.message);
        }
    };

    const createPatient = async (patientData) => {
        try {
            setLoading(true);
            const newPatient = await patientsAPI.create(patientData);
            setPatients(prev => [...prev, newPatient]);
            return newPatient;
        } catch (err) {
            setError('Error al crear paciente: ' + err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
        loadObrasSociales();
    }, []);

    return {
        patients,
        obrasSociales,
        loading,
        error,
        loadPatients,
        createPatient,
        setError
    };
};

