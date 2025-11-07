import { getAuthHeaders, isAuthenticated, logout } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8000';

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = isAuthenticated()
    ? { ...getAuthHeaders(), ...options.headers }
    : { 'Content-Type': 'application/json', ...options.headers };

    const config = {
        headers,
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            logout();
            window.location.href = '/login';
            throw new Error('Sesión expirada');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

export const patientsAPI = {
    getAll: async () => {
        const response = await apiRequest('/api/pacientes/');
        return response.json();
    },
    getById: async (id) => {
        const response = await apiRequest(`/api/pacientes/${id}/`);
        return response.json();
    },
    getByDni: async (dni) => {
        const response = await apiRequest(`/api/pacientes/?dni=${dni}`);
        return response.json();
    },

    create: async (patientData) => {
        const response = await apiRequest('/api/pacientes/', {
            method: 'POST',
            body: JSON.stringify(patientData),
        });
        return response.json();
    },

    update: async (id, patientData) => {
        const response = await apiRequest(`/api/pacientes/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(patientData),
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await apiRequest(`/api/pacientes/${id}/`, {
            method: 'DELETE',
        });
        return response.ok;
    },
    // Antecedentes
    antecedentes: {
        getByPatient: async (patientId) => {
            const response = await apiRequest(`/api/entradas-antecedentes/?paciente=${patientId}`);
            return response.json();
        },

        // Crear nueva entrada de antecedente
        create: async (antecedenteData) => {
            const response = await apiRequest('/api/entradas-antecedentes/', {
                method: 'POST',
                body: JSON.stringify(antecedenteData),
            });
            return response.json();
        },

        // Actualizar entrada de antecedente
        update: async (id, antecedenteData) => {
            const response = await apiRequest(`/api/entradas-antecedentes/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(antecedenteData),
            });
            return response.json();
        },

        // Eliminar entrada de antecedente
        delete: async (id) => {
            const response = await apiRequest(`/api/entradas-antecedentes/${id}/`, {
                method: 'DELETE',
            });
            return response.ok;
        },

        // Obtener vínculos de antecedentes (solo lectura)
        getVinculos: async (patientId) => {
            const response = await apiRequest(`/api/antecedentes/?paciente=${patientId}`);
            return response.json();
        }
    }
};

export const obrasSocialesAPI = {
    getAll: async() => {
        const response = await apiRequest('/api/obras-sociales/');
        return response.json();
    }, 

    create: async(obraSocialData) => {
        const response = await apiRequest('/api/obras-sociales/', {
            method: 'POST',
            body: JSON.stringify(obraSocialData),
        });
        return response.json()
    }
};

export const turnosAPI = {
    getAll: async () => {
        const response = await apiRequest('/api/turnos/')
        return response.json();
    },

    getByDate: async (fecha) => {
        const response = await apiRequest(`/api/turnos/?fecha=${fecha}`);
        return response.json();
    },

    getByPatient: async (patientId) => {
        const response = await apiRequest(`/api/turnos/?paciente=${patientId}`);
        return response.json();
    },

    create: async (turnoData) => {
        const response = await apiRequest('/api/turnos/', {
            method: 'POST',
            body: JSON.stringify(turnoData),
        });
        return response.json();
    },

    update: async (id, turnoData) => {
        const response= await apiRequest(`/api/turnos/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(turnoData),
        });
        return response.json();
    },
    
    delete: async (id) => {
        const response = await apiRequest(`/api/turnos/${id}/`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    getAgendaDay: async (fecha, odontologoId = null) => {
        let url = `/api/turnos/agenda_dia/?fecha=${fecha}`;
        if (odontologoId) {
            url += `&odontologo_id=${odontologoId}`;
        }
        const response = await apiRequest(url);
        return response.json();
    }
};

export const odontologosAPI = {
    getAll: async () => {
        const response = await apiRequest('/odontologos/odontologos/');
        return response.json();
    },

    getById: async (id) => {
        const response = await apiRequest(`/odontologos/odontologos/${id}/`);
        return response.json();
    }
};

export const especialidadesAPI = {
    getAll: async () => {
        const response = await apiRequest('/odontologos/especialidades/');
        return response.json();
    }
};