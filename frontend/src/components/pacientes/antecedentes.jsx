import { useState, useEffect } from "react";
import ModalAgregarAntecedente from "./modal-agregar-antecedente";
import { patientsAPI } from "../../services/api";
import { formatearFecha } from "../../utils/dateUtils";

export default function Antecedentes({ pacienteId }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [antecedentes, setAntecedentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAntecedentes = async () => {
      try {
        setLoading(true);
        setError(null);
        const antecedentesData = await patientsAPI.antecedentes.getByPatient(pacienteId);
        setAntecedentes(antecedentesData || []);
      } catch (err) {
        console.error('Error al cargar antecedentes:', err);
        setError('Error al cargar antecedentes: ' + err.message);
        setAntecedentes([]);
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      loadAntecedentes();
    }
  }, [pacienteId]);

  const handleAddAntecedente = async (nuevoAntecedente) => {
    try {
      // Crear antecedente en el backend
      const antecedenteData = {
        paciente: pacienteId,
        fecha: nuevoAntecedente.fecha,
        antecedente: nuevoAntecedente.descripcion
      };
      
      const antecedenteCreado = await patientsAPI.antecedentes.create(antecedenteData);
      
      // Actualizar la lista local
      setAntecedentes(prev => [antecedenteCreado, ...prev]);
      
      console.log('Antecedente creado exitosamente:', antecedenteCreado);
    } catch (err) {
      console.error('Error al crear antecedente:', err);
      setError('Error al guardar el antecedente: ' + err.message);
    }
  };

  const handleDeleteAntecedente = async (id) => {
    try {
      // Eliminar del backend
      await patientsAPI.antecedentes.delete(id);
      
      // Actualizar la lista local
      setAntecedentes(prev => prev.filter(ant => ant.id !== id));
      
      console.log('Antecedente eliminado:', id);
    } catch (err) {
      console.error('Error al eliminar antecedente:', err);
      setError('Error al eliminar el antecedente: ' + err.message);
    }
  };

  const s = {
    grid: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    card: {
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      position: "relative",
    },
    addButton: {
      background: "#f8fafc",
      padding: 20,
      borderRadius: 12,
      border: "2px dashed #cbd5e1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#475569",
      cursor: "pointer",
      transition: "all .2s ease",
    },
    deleteButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    loading: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6b7280",
      fontSize: "1rem",
    },
    error: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "20px",
      color: "#dc2626",
      textAlign: "center",
      marginBottom: "20px",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6b7280",
      fontSize: "1rem",
      fontStyle: "italic",
    },
  };

  if (loading) {
    return <div style={s.loading}>Cargando antecedentes...</div>
  }

  return (
    <>
      {error && <div style={s.error}>{error}</div>}

      <div style={s.grid}>
        {/* Cards de antecedentes */}
        {antecedentes.length === 0 ? (
          <div style={s.emptyState}>
            No hay antecedentes médicos registrados.
            <br />
            Haga clic en "Agregar Antecedente" para comenzar.
          </div>
        ) : (
          antecedentes.map((a) => (
            <div key={a.id} style={s.card}>
              <button
                style={s.deleteButton}
                onClick={() => handleDeleteAntecedente(a.id)}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                title="Eliminar antecedente"
              >
                ✕
              </button>
              <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
                📅 {formatearFecha(a.fecha)}
              </p>
              <p style={{ fontSize: 16, color: "#111827", lineHeight: 1.5 }}>
                {a.antecedente || a.descripcion}
              </p>
            </div>
          ))
        )}

        {/* Card para abrir modal */}
        <div
          style={s.addButton}
          onClick={() => setMostrarModal(true)}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f8fafc")}
        >
          <span style={{ fontSize: 24 }}>➕</span>
          <p style={{ marginTop: 8, fontWeight: 600 }}>Agregar nuevo antecedente</p>
        </div>
      </div>

      {/* Modal para agregar nuevo antecedente */}
      <ModalAgregarAntecedente
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onAdd={handleAddAntecedente}
      />
    </>
  );
}
