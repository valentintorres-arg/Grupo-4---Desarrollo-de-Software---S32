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
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorBody = await response.text();
                console.error('Error response body:', errorBody);
                if (errorBody) {
                    errorMessage += ` - ${errorBody}`;
                }
            } catch (e) {
                console.error('Could not parse error response:', e);
            }
            throw new Error(errorMessage);
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

export const tratamientosAPI = {
    getAll: async () => {
        const response = await apiRequest('/api/tratamientos/');
        return response.json();
    },

    getById: async (id) => {
        const response = await apiRequest(`/api/tratamientos/${id}/`);
        return response.json();
    },

    getByPatient: async (patientId) => {
        const response = await apiRequest(`/api/tratamientos/?paciente=${patientId}`);
        return response.json();
    },

    getByOdontologo: async (odontologoId) => {
        const response = await apiRequest(`/api/tratamientos/?odontologo=${odontologoId}`);
        return response.json();
    },

    getByEstado: async (estadoId) => {
        const response = await apiRequest(`/api/tratamientos/?estado=${estadoId}`);
        return response.json();
    },

    create: async (tratamientoData) => {
        const response = await apiRequest('/api/tratamientos/', {
            method: 'POST',
            body: JSON.stringify(tratamientoData),
        });
        return response.json();
    },

    update: async (id, tratamientoData) => {
        const response = await apiRequest(`/api/tratamientos/${id}/`, {
            method: 'PATCH', // Usar PATCH para actualizaciones parciales
            body: JSON.stringify(tratamientoData),
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await apiRequest(`/api/tratamientos/${id}/`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    finalizar: async (id, fechaFin) => {
        const response = await apiRequest(`/api/tratamientos/${id}/finalizar/`, {
            method: 'PATCH',
            body: JSON.stringify({ fecha_fin: fechaFin }),
        });
        return response.json();
    }
};

export const estadosTratamientoAPI = {
    getAll: async () => {
        const response = await apiRequest('/api/estados-tratamiento/');
        return response.json();
    },

    getById: async (id) => {
        const response = await apiRequest(`/api/estados-tratamiento/${id}/`);
        return response.json();
    }
};

export const odontogramaAPI = {
    // Obtener odontograma por paciente (crea uno vacío si no existe)
    getByPatient: async (patientId) => {
        const response = await apiRequest(`/api/odontogramas/por_paciente/?paciente_id=${patientId}`);
        return response.json();
    },

    // Obtener odontograma completo por ID
    getById: async (id) => {
        const response = await apiRequest(`/api/odontogramas/${id}/`);
        return response.json();
    },

    // Actualizar una superficie específica de un diente
    updateSuperficie: async (odontogramaId, fdi, superficie, colorCodigo) => {
        const response = await apiRequest(`/api/odontogramas/${odontogramaId}/actualizar_superficie/`, {
            method: 'POST',
            body: JSON.stringify({
                fdi: fdi,
                superficie: superficie,
                color_codigo: colorCodigo
            }),
        });
        return response.json();
    },

    // Guardar odontograma completo (solo datos modificados)
    save: async (patientId, datosModificados) => {
        // Solo enviamos superficies que NO sean blancas (sanas)
        const datosFiltrados = datosModificados.filter(dato => dato.color_codigo !== 'blanco');
        
        const response = await apiRequest(`/api/odontogramas/por_paciente/`, {
            method: 'POST',
            body: JSON.stringify({
                paciente_id: patientId,
                datos: datosFiltrados
            }),
        });
        return response.json();
    },

    // Resetear diente completo a sano (elimina todos sus datos)
    resetDiente: async (patientId, fdi) => {
        // Primero obtenemos el odontograma
        const odontograma = await odontogramaAPI.getByPatient(patientId);
        
        // Filtramos todos los datos de este diente
        const datosActuales = odontograma.datos || [];
        const datosSinDiente = datosActuales.filter(dato => dato.fdi !== fdi);
        
        // Guardamos sin este diente (vuelve a ser todo blanco/sano)
        return await odontogramaAPI.save(patientId, datosSinDiente);
    },

    // Obtener estado de una superficie específica
    getSuperficieEstado: (odontograma, fdi, superficie) => {
        if (!odontograma || !odontograma.datos) return 'blanco'; // Default sano
        
        const dato = odontograma.datos.find(d => d.fdi === fdi && d.superficie === superficie);
        return dato ? dato.color_codigo : 'blanco'; // Si no existe, es sano
    },

    // Obtener todos los estados de un diente
    getDienteEstados: (odontograma, fdi) => {
        const estados = {
            1: 'blanco', // Oclusal/Incisal
            2: 'blanco', // Mesial  
            3: 'blanco', // Distal
            4: 'blanco', // Vestibular
            5: 'blanco'  // Lingual
        };

        if (odontograma && odontograma.datos) {
            odontograma.datos
                .filter(dato => dato.fdi === fdi)
                .forEach(dato => {
                    estados[dato.superficie] = dato.color_codigo;
                });
        }

        return estados;
    },

    // Construir datos para enviar al backend
    buildDatosModificados: (odontogramaLocal) => {
        const datos = [];
        
        Object.keys(odontogramaLocal).forEach(fdi => {
            const dienteEstados = odontogramaLocal[fdi];
            
            Object.keys(dienteEstados).forEach(superficie => {
                const color = dienteEstados[superficie];
                
                // Solo agregar si NO es blanco (sano)
                if (color && color !== 'blanco') {
                    datos.push({
                        fdi: parseInt(fdi),
                        superficie: parseInt(superficie),
                        color_codigo: color
                    });
                }
            });
        });
        
        return datos;
    }
};