import { useState, useEffect } from "react";
import ModalAgregarAntecedente from "./modal-agregar-antecedente";
import { patientsAPI } from "../../services/api";
import { formatearFecha } from "../../utils/dateUtils";

export default function Antecedentes({ pacienteId }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [antecedentes, setAntecedentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAntecedente, setEditingAntecedente] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAntecedente, setPendingAntecedente] = useState(null);

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

  const handleAddAntecedente = (nuevoAntecedente) => {
    // Primero mostrar el diálogo de confirmación
    setPendingAntecedente(nuevoAntecedente);
    setShowConfirmDialog(true);
  };

  const confirmAddAntecedente = async () => {
    try {
      // Crear antecedente en el backend
      const antecedenteData = {
        paciente: pacienteId,
        fecha: pendingAntecedente.fecha,
        antecedente: pendingAntecedente.descripcion
      };
      
      const antecedenteCreado = await patientsAPI.antecedentes.create(antecedenteData);
      
      // Actualizar la lista local
      setAntecedentes(prev => [antecedenteCreado, ...prev]);
      
      console.log('Antecedente creado exitosamente:', antecedenteCreado);
      
      // Limpiar estados
      setShowConfirmDialog(false);
      setPendingAntecedente(null);
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al crear antecedente:', err);
      setError('Error al guardar el antecedente: ' + err.message);
      setShowConfirmDialog(false);
      setPendingAntecedente(null);
    }
  };

  const cancelAddAntecedente = () => {
    setShowConfirmDialog(false);
    setPendingAntecedente(null);
  };

  const handleEditAntecedente = (antecedente) => {
    setEditingAntecedente(antecedente);
    setMostrarModal(true);
  };

  const handleUpdateAntecedente = async (antecedenteActualizado) => {
    try {
      const antecedenteData = {
        paciente: pacienteId,
        fecha: antecedenteActualizado.fecha,
        antecedente: antecedenteActualizado.descripcion
      };
      
      const antecedenteEditado = await patientsAPI.antecedentes.update(editingAntecedente.id, antecedenteData);
      
      // Actualizar la lista local
      setAntecedentes(prev => prev.map(ant => 
        ant.id === editingAntecedente.id ? antecedenteEditado : ant
      ));
      
      console.log('Antecedente actualizado exitosamente:', antecedenteEditado);
      
      // Limpiar estados
      setEditingAntecedente(null);
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al actualizar antecedente:', err);
      setError('Error al actualizar el antecedente: ' + err.message);
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
    editButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    confirmDialog: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    confirmContent: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "400px",
      width: "90%",
      textAlign: "center",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    },
    confirmButtons: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      marginTop: "20px",
    },
    confirmButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    confirmButtonYes: {
      backgroundColor: "#10b981",
      color: "#fff",
    },
    confirmButtonNo: {
      backgroundColor: "#ef4444",
      color: "#fff",
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
                style={s.editButton}
                onClick={() => handleEditAntecedente(a)}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
                title="Modificar antecedente"
              >
                ✏️
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
        onClose={() => {
          setMostrarModal(false);
          setEditingAntecedente(null);
        }}
        onAdd={editingAntecedente ? handleUpdateAntecedente : handleAddAntecedente}
        initialData={editingAntecedente ? {
          fecha: editingAntecedente.fecha,
          descripcion: editingAntecedente.antecedente
        } : null}
        isEditing={!!editingAntecedente}
      />

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div style={s.confirmDialog}>
          <div style={s.confirmContent}>
            <h3 style={{ margin: "0 0 16px 0", color: "#111827" }}>
              ¿Está seguro que desea crear este antecedente?
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#6b7280" }}>
              Esta acción agregará un nuevo antecedente médico al historial del paciente.
            </p>
            <div style={s.confirmButtons}>
              <button
                style={{ ...s.confirmButton, ...s.confirmButtonYes }}
                onClick={confirmAddAntecedente}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
              >
                Sí, crear
              </button>
              <button
                style={{ ...s.confirmButton, ...s.confirmButtonNo }}
                onClick={cancelAddAntecedente}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
