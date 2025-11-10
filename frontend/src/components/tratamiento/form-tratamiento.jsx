import { useState, useEffect } from "react";
import { tratamientosAPI, patientsAPI, odontologosAPI } from "../../services/api";
import { getUserData } from "../../utils/auth";

export default function FormTratamiento({ onTratamientoCreated, pacienteId = null }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    paciente: pacienteId || "",
    estado: 1,
    fecha_inicio: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    duracion_estimada: "",
    odontologo: ""
  });

  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchDni, setSearchDni] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadPacientes();
    loadCurrentOdontologo();
  }, []);

  useEffect(() => {
    if (searchDni.trim()) {
      const filtered = pacientes.filter(paciente =>
        paciente.dni.toString().includes(searchDni) ||
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(searchDni.toLowerCase())
      );
      setFilteredPacientes(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredPacientes([]);
      setShowDropdown(false);
    }
  }, [searchDni, pacientes]);

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadPacientes = async () => {
    try {
      const pacientesData = await patientsAPI.getAll();
      setPacientes(pacientesData);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
      setError("Error al cargar lista de pacientes");
    }
  };

  const loadCurrentOdontologo = async () => {
    try {
      const userData = getUserData();
      if (userData.matricula) {
        const odontologo = await odontologosAPI.getByMatricula(userData.matricula);
        if (odontologo) {
          setFormulario(prev => ({ ...prev, odontologo: odontologo.id }));
        }
      }
    } catch (err) {
      console.error("Error al cargar odontólogo actual:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSearchDni = (e) => {
    setSearchDni(e.target.value);
  };

  const selectPaciente = (paciente) => {
    setFormulario(prev => ({ ...prev, paciente: paciente.id }));
    setSearchDni(`${paciente.dni} - ${paciente.nombre} ${paciente.apellido}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tratamientoData = {
        ...formulario,
        duracion_estimada: parseInt(formulario.duracion_estimada)
      };

      const nuevoTratamiento = await tratamientosAPI.create(tratamientoData);

      setSuccess("Tratamiento registrado exitosamente");
      setFormulario({
        nombre: "",
        descripcion: "",
        paciente: pacienteId || "",
        estado: 1,
        fecha_inicio: new Date().toISOString().split('T')[0], // Mantener fecha de hoy
        duracion_estimada: "",
        odontologo: formulario.odontologo
      });
      setSearchDni("");

      if (onTratamientoCreated) onTratamientoCreated(nuevoTratamiento);

    } catch (err) {
      console.error("Error al crear tratamiento:", err);
      setError("Error al registrar el tratamiento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "40px"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    headerTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "8px",
      marginTop: '1.5rem'
    },
    headerSubtitle: {
      fontSize: "1rem",
      color: "#6b7280"
    },
    form: {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      padding: "24px",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto"
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "30px",
      textAlign: "center"
    },
    inputGroup: { marginBottom: "20px" },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "6px"
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.2s ease",
      outline: "none"
    },
    textarea: {
      width: "100%",
      border: "1px solid #d1d5db",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.2s ease",
      outline: "none",
      resize: "vertical",
      minHeight: "100px"
    },
    button: {
      backgroundColor: "#3b82f6",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%"
    },
    buttonDisabled: {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed"
    },
    error: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "12px",
      color: "#dc2626",
      fontSize: "14px",
      marginBottom: "16px"
    },
    success: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #7dd3fc",
      borderRadius: "8px",
      padding: "12px",
      color: "#0369a1",
      fontSize: "14px",
      marginBottom: "16px"
    },
    searchContainer: { position: "relative" },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 1000,
      maxHeight: "200px",
      overflowY: "auto"
    },
    dropdownItem: {
      padding: "12px 16px",
      cursor: "pointer",
      borderBottom: "1px solid #f3f4f6",
      transition: "background-color 0.2s ease"
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Registrar Tratamiento</h2>
        <p style={styles.headerSubtitle}>
          Completá los datos del tratamiento para vincularlo a un paciente.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nombre del Tratamiento *</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Ej: Ortodoncia, Limpieza dental, etc."
            required
          />
        </div>

        {!pacienteId && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Buscar Paciente por DNI *</label>
            <div style={styles.searchContainer} onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={searchDni}
                onChange={handleSearchDni}
                style={styles.input}
                placeholder="Ingrese DNI o nombre del paciente"
                required={!formulario.paciente}
              />
              {showDropdown && (
                <div style={styles.dropdown}>
                  {filteredPacientes.map(paciente => (
                    <div
                      key={paciente.id}
                      style={styles.dropdownItem}
                      onClick={() => selectPaciente(paciente)}
                      onMouseEnter={e => e.target.style.backgroundColor = "#f9fafb"}
                      onMouseLeave={e => e.target.style.backgroundColor = "#fff"}
                    >
                      <div style={{ fontWeight: "500" }}>
                        {paciente.nombre} {paciente.apellido}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        DNI: {paciente.dni}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <input
          type="hidden"
          name="odontologo"
          value={formulario.odontologo}
        />

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fecha de Inicio *</label>
          <input
            type="date"
            name="fecha_inicio"
            value={formulario.fecha_inicio}
            onChange={handleInputChange}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Duración Estimada (meses) *</label>
          <input
            type="number"
            name="duracion_estimada"
            value={formulario.duracion_estimada}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Ej: 6, 12, 24"
            min="1"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Descripción del Tratamiento *</label>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Describe detalladamente el tratamiento a realizar..."
            required
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#2563eb")}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#3b82f6")}
        >
          {loading ? "Registrando..." : "Registrar Tratamiento"}
        </button>
      </form>
    </div>
  );
}
