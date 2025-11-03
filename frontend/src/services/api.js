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
        const response = await apiRequest(`api/pacientes/${id}/`, {
            method: 'DELETE',
        });
        return response.ok;
    }
};

export const obrasSocialesAPI = {
    getAll: async() => {
        const response = await apiRequest('/api/obras-sociales/');
        return response.json();
    }, 

    create: async(obraSocialData) => {
        const response = await apiRequest('api/obras-sociales', {
            method: 'POST',
            body: JSON.stringify(obraSocialData),
        });
        return response.json()
    }
};