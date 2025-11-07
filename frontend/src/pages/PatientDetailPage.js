import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { patientsAPI } from "../services/api";
import { calcularEdad, formatearFecha } from "../utils/dateUtils";
import Odontograma from "../components/pacientes/odontograma";
import Antecedentes from "../components/pacientes/antecedentes";
import PatientAppointments from "../components/turnos/PatientAppointments";
import VistaPreviaTratamiento from "../components/tratamiento/vista-previa-tratamiento";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const patientData = await patientsAPI.getById(id);
        setPatient(patientData);
      } catch (err) {
        setError('Error al cargar el paciente: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPatient();
    }
  }, [id]);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "90px 20px 40px",
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    backButton: {
      backgroundColor: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "20px",
      transition: "all 0.2s ease",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #3b82f6, #1e40af)",
      color: "#fff",
      padding: "30px",
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "1.1rem",
      opacity: "0.9",
    },
    
    // Tabs
    tabsContainer: {
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f8fafc",
      padding: "0 30px",
    },
    tabs: {
      display: "flex",
      gap: "0",
    },
    tab: {
      padding: "16px 24px",
      border: "none",
      backgroundColor: "transparent",
      color: "#6b7280",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      transition: "all 0.2s ease",
      position: "relative",
    },
    activeTab: {
      color: "#3b82f6",
      borderBottomColor: "#3b82f6",
      backgroundColor: "#fff",
    },
    
    body: {
      padding: "30px",
    },
    section: {
      marginBottom: "30px",
      paddingBottom: "20px",
      borderBottom: "1px solid #e5e7eb",
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    
    // Grid horizontal para campos
    horizontalGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px 40px",
      marginBottom: "20px",
    },
    
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    value: {
      fontSize: "1rem",
      color: "#111827",
      fontWeight: "500",
    },
    
    // Full width para dirección
    fullWidthField: {
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    
    loading: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6b7280",
      fontSize: "1.1rem",
    },
    error: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "20px",
      color: "#dc2626",
      textAlign: "center",
      margin: "20px auto",
      maxWidth: "600px",
    },
    notFound: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6b7280",
    },
    icon: {
      fontSize: "1.2rem",
    },
    
    // Contenido de tabs no activos
    tabContent: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#6b7280",
      fontSize: "1.1rem",
    },
    
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          Cargando informacion del paciente...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/patients")}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#4b5563"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#6b7280"}
          >
            ← Volver a la lista
          </button>
          <div style={styles.error}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/patients")}
          >
            ← Volver a la lista
          </button>
          <div style={styles.notFound}>
            Paciente no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/patients")}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#4b5563"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#6b7280"}
        >
          ← Volver a la lista
        </button>

        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {patient.nombre} {patient.apellido}
            </h1>
            <p style={styles.subtitle}>
              {calcularEdad(patient.fecha_nacimiento)} años • DNI: {patient.dni}
            </p>
          </div>
          
          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <div style={styles.tabs}>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'personal' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('personal')}
              >
                Personal
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'odontograma' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('odontograma')}
              >
                Odontograma
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'antecedentes' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('antecedentes')}
              >
                Antecedentes
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'turnos' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('turnos')}
              >
                Turnos
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'tratamientos' ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab('tratamientos')}
              >
                Tratamientos
              </button>
            </div>
          </div>
          
          <div style={styles.body}>
            {/* Contenido de Personal */}
            {activeTab === 'personal' && (
              <div>
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.icon}>👤</span>
                    Datos Personales
                  </h2>
                  <div style={styles.horizontalGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>Fecha de Nacimiento</label>
                      <span style={styles.value}>
                        {formatearFecha(patient.fecha_nacimiento)}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Género</label>
                      <span style={styles.value}>
                        {patient.genero_display || 'No especificado'}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Email</label>
                      <span style={styles.value}>
                        {patient.email || 'No especificado'}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Teléfono</label>
                      <span style={styles.value}>
                        {patient.telefono || 'No especificado'}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>ID del Paciente</label>
                      <span style={styles.value}>#{patient.id}</span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>DNI</label>
                      <span style={styles.value}>{patient.dni}</span>
                    </div>
                    <div style={styles.fullWidthField}>
                      <label style={styles.label}>Dirección</label>
                      <span style={styles.value}>
                        {patient.direccion || 'No especificada'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.icon}>🏥</span>
                    Obra Social
                  </h2>
                  <div style={styles.horizontalGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>Obra Social</label>
                      <span style={styles.value}>
                        {patient.obraSocial_data?.nombre || 'No especificada'}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Cobertura</label>
                      <span style={styles.value}>
                        {patient.obraSocial_data?.cobertura ? 
                          `${patient.obraSocial_data.cobertura}%` : 
                          'No especificada'}
                      </span>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Número de Socio</label>
                      <span style={styles.value}>
                        {patient.numeroOS || 'No especificado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contacto de Emergencia */}
                {(patient.contacto_emergencia_nombre || 
                  patient.contacto_emergencia_relacion || 
                  patient.contacto_emergencia_telefono) && (
                  <div style={{...styles.section, borderBottom: "none"}}>
                    <h2 style={styles.sectionTitle}>
                      <span style={styles.icon}>🚨</span>
                      Contacto de Emergencia
                    </h2>
                    <div style={styles.horizontalGrid}>
                      {patient.contacto_emergencia_nombre && (
                        <div style={styles.field}>
                          <label style={styles.label}>Nombre</label>
                          <span style={styles.value}>
                            {patient.contacto_emergencia_nombre}
                          </span>
                        </div>
                      )}
                      {patient.contacto_emergencia_relacion && (
                        <div style={styles.field}>
                          <label style={styles.label}>Relación</label>
                          <span style={styles.value}>
                            {patient.contacto_emergencia_relacion}
                          </span>
                        </div>
                      )}
                      {patient.contacto_emergencia_telefono && (
                        <div style={styles.field}>
                          <label style={styles.label}>Teléfono</label>
                          <span style={styles.value}>
                            {patient.contacto_emergencia_telefono}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contenido de otros tabs */}
            {activeTab === 'odontograma' && (
              <div>
                <Odontograma pacienteId={patient?.id} />
              </div>
            )}

            {activeTab === 'antecedentes' && (
              <div>
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.icon}>📋</span>
                    Antecedentes Médicos
                  </h2>
                  <Antecedentes pacienteId={patient?.id} />
                </div>
              </div>
            )}

            {activeTab === 'turnos' && (
              <div>
                <PatientAppointments pacienteId={patient?.id} />
              </div>
            )}

            {activeTab === 'tratamientos' && (
              <div>
                <VistaPreviaTratamiento pacienteId={patient?.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}