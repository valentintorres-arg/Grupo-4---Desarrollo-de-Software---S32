import { useState, useEffect } from "react";
import { tratamientosAPI, estadosTratamientoAPI } from "../../services/api";
import { formatearFecha } from "../../utils/dateUtils";
import EvolucionList from "./EvolucionList";
import EvolucionForm from "./EvolucionForm";

export default function VistaPreviaTratamiento({ pacienteId }) {
  const [tratamientos, setTratamientos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTratamiento, setEditingTratamiento] = useState(null);
  const [expandedTratamientoId, setExpandedTratamientoId] = useState(null);
  const [evolucionUpdateTrigger, setEvolucionUpdateTrigger] = useState(0);
  const [editingEvolucion, setEditingEvolucion] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
    fecha_inicio: "",
    fecha_fin: "",
    duracion_estimada: ""
  });

  useEffect(() => {
    const loadData = async () => {
      if (!pacienteId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Cargar tratamientos y estados en paralelo
        const [tratamientosData, estadosData] = await Promise.all([
          tratamientosAPI.getByPatient(pacienteId),
          estadosTratamientoAPI.getAll()
        ]);
        
        setTratamientos(tratamientosData || []);
        setEstados(estadosData || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos: ' + err.message);
        setTratamientos([]);
        setEstados([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pacienteId]);

  const getEstadoColor = (estado) => {
    const colores = {
      'Programado': '#f59e0b',
      'En Progreso': '#10b981', 
      'Finalizado': '#6b7280',
      'Suspendido': '#ef4444',
      'Cancelado': '#dc2626'
    };
    return colores[estado] || '#6b7280';
  };

  const handleFinalizarTratamiento = async (id) => {
    if (window.confirm('¿Seguro que querés finalizar este tratamiento?')) {
      try {
        const fechaFin = new Date().toISOString().split('T')[0];
        await tratamientosAPI.finalizar(id, fechaFin);
        
        // Recargar la lista
        const tratamientosData = await tratamientosAPI.getByPatient(pacienteId);
        setTratamientos(tratamientosData || []);
      } catch (err) {
        console.error('Error al finalizar tratamiento:', err);
        setError('Error al finalizar el tratamiento: ' + err.message);
      }
    }
  };

  const handleModificarTratamiento = (tratamiento) => {
    setEditingTratamiento(tratamiento);
    setEditForm({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      estado: tratamiento.estado,
      fecha_inicio: tratamiento.fecha_inicio,
      fecha_fin: tratamiento.fecha_fin || "",
      duracion_estimada: tratamiento.duracion_estimada
    });
  };

  const handleEliminarTratamiento = async (id) => {
    if (window.confirm('¿Seguro que querés eliminar este tratamiento? Esta acción no se puede deshacer.')) {
      try {
        await tratamientosAPI.delete(id);
        
        // Recargar la lista
        const tratamientosData = await tratamientosAPI.getByPatient(pacienteId);
        setTratamientos(tratamientosData || []);
      } catch (err) {
        console.error('Error al eliminar tratamiento:', err);
        setError('Error al eliminar el tratamiento: ' + err.message);
      }
    }
  };

  const handleSaveModificacion = async () => {
    try {
      // Validaciones básicas
      if (!editForm.nombre.trim()) {
        setError('El nombre del tratamiento es requerido');
        return;
      }
      if (!editForm.descripcion.trim()) {
        setError('La descripción del tratamiento es requerida');
        return;
      }
      if (!editForm.fecha_inicio) {
        setError('La fecha de inicio es requerida');
        return;
      }
      if (!editForm.duracion_estimada || editForm.duracion_estimada < 1) {
        setError('La duración estimada debe ser mayor a 0');
        return;
      }

      const updateData = {
        nombre: editForm.nombre.trim(),
        descripcion: editForm.descripcion.trim(),
        estado: parseInt(editForm.estado),
        fecha_inicio: editForm.fecha_inicio,
        duracion_estimada: parseInt(editForm.duracion_estimada)
      };

      // Solo incluir fecha_fin si tiene valor
      if (editForm.fecha_fin) {
        updateData.fecha_fin = editForm.fecha_fin;
      }

      console.log('Datos a enviar:', updateData); // Para debug

      await tratamientosAPI.update(editingTratamiento.id, updateData);
      
      // Recargar la lista
      const tratamientosData = await tratamientosAPI.getByPatient(pacienteId);
      setTratamientos(tratamientosData || []);
      
      // Cerrar modal
      setEditingTratamiento(null);
      setEditForm({ 
        nombre: "",
        descripcion: "",
        estado: "",
        fecha_inicio: "",
        fecha_fin: "",
        duracion_estimada: ""
      });
      
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error('Error al modificar tratamiento:', err);
      console.error('Response completo:', err.response); // Para debug
      setError('Error al modificar el tratamiento: ' + err.message);
    }
  };

  const handleCancelModificacion = () => {
    setEditingTratamiento(null);
    setEditForm({ 
      nombre: "",
      descripcion: "",
      estado: "",
      fecha_inicio: "",
      fecha_fin: "",
      duracion_estimada: ""
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleEvoluciones = (tratamientoId) => {
    setExpandedTratamientoId(prevId => (prevId === tratamientoId ? null : tratamientoId));
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    icon: {
      fontSize: "1.2rem",
    },
    tratamientoCard: {
      background: "#fff",
      padding: "20px 60px 20px 20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #e5e7eb",
      position: "relative",
    },
    tratamientoHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
      marginRight: "80px",
    },
    tratamientoNombre: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#111827",
      marginBottom: "4px",
    },
    estadoBadge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 500,
      color: "#fff",
    },
    tratamientoInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    label: {
      fontWeight: 600,
      color: "#374151",
      minWidth: "120px",
    },
    value: {
      color: "#6b7280",
    },
    descripcion: {
      marginTop: "12px",
      padding: "12px",
      backgroundColor: "#f9fafb",
      borderRadius: "6px",
      fontSize: "14px",
      lineHeight: "1.5",
      color: "#4b5563",
    },
    actionButtons: {
      position: "absolute",
      top: "12px",
      right: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    button: {
      padding: "6px 12px",
      borderRadius: "6px",
      border: "none",
      fontSize: "12px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
    finalizarButton: {
      backgroundColor: "#10b981",
      color: "#fff",
    },
    modificarButton: {
      backgroundColor: "#f59e0b",
      color: "#fff",
    },
    eliminarButton: {
      backgroundColor: "#ef4444",
      color: "#fff",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "400px",
      maxWidth: "500px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "16px",
    },
    modalField: {
      marginBottom: "16px",
    },
    modalLabel: {
      display: "block",
      fontSize: "14px",
      fontWeight: 500,
      color: "#374151",
      marginBottom: "6px",
    },
    modalSelect: {
      width: "100%",
      border: "1px solid #d1d5db",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      outline: "none",
    },
    modalInput: {
      width: "100%",
      border: "1px solid #d1d5db",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    modalButton: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    saveButton: {
      backgroundColor: "#3b82f6",
      color: "#fff",
    },
    cancelButton: {
      backgroundColor: "#6b7280",
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
      padding: "16px",
      color: "#dc2626",
      textAlign: "center",
      marginBottom: "16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6b7280",
      fontSize: "1rem",
      fontStyle: "italic",
    },

    evolucionesSection: {
      marginTop: '20px',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '20px'
    },
    evolucionesButton: {
      backgroundColor: "#6366f1",
      color: "#fff",
      marginTop: "15px",
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500"
    },

  };

  if (!pacienteId) {
    return null; // No mostrar nada cuando no hay paciente seleccionado
  }

  if (loading) {
    return (
      <div>
        <div style={styles.loading}>Cargando tratamientos...</div>
      </div>
    );
  }

  return (
    <div>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.container}>
        {tratamientos.length === 0 ? (
          <div style={styles.emptyState}>
            No hay tratamientos registrados para este paciente.
          </div>
        ) : (
          tratamientos
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((tratamiento) => (
              <div key={tratamiento.id} style={styles.tratamientoCard}>
                <div style={styles.actionButtons}>
                  {tratamiento.estado_nombre !== 'Finalizado' && tratamiento.estado_nombre !== 'Cancelado' && (
                    <button
                      style={{...styles.button, ...styles.finalizarButton}}
                      onClick={() => handleFinalizarTratamiento(tratamiento.id)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                      title="Finalizar tratamiento"
                    >
                      Finalizar
                    </button>
                  )}
                  <button
                    style={{...styles.button, ...styles.modificarButton}}
                    onClick={() => handleModificarTratamiento(tratamiento)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
                    title="Modificar tratamiento"
                  >
                    Modificar
                  </button>
                  <button
                    style={{...styles.button, ...styles.eliminarButton}}
                    onClick={() => handleEliminarTratamiento(tratamiento.id)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                    title="Eliminar tratamiento"
                  >
                    Eliminar
                  </button>
                </div>

                <div style={styles.tratamientoHeader}>
                  <div>
                    <div style={styles.tratamientoNombre}>
                      {tratamiento.nombre}
                    </div>
                  </div>
                  <div 
                    style={{
                      ...styles.estadoBadge,
                      backgroundColor: getEstadoColor(tratamiento.estado_nombre)
                    }}
                  >
                    {tratamiento.estado_nombre}
                  </div>
                </div>

                <div style={styles.tratamientoInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Odontólogo:</span>
                    <span style={styles.value}>
                      Dr. {tratamiento.odontologo_nombre} {tratamiento.odontologo_apellido}
                    </span>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Fecha de inicio:</span>
                    <span style={styles.value}>
                      {formatearFecha(tratamiento.fecha_inicio)}
                    </span>
                  </div>

                  {tratamiento.fecha_fin && (
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Fecha de fin:</span>
                      <span style={styles.value}>
                        {formatearFecha(tratamiento.fecha_fin)}
                      </span>
                    </div>
                  )}

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Duración estimada:</span>
                    <span style={styles.value}>
                      {tratamiento.duracion_estimada} meses
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Matrícula:</span>
                    <span style={styles.value}>
                      {tratamiento.odontologo_matricula}
                    </span>
                  </div>
                </div>

                {tratamiento.descripcion && (
                  <div style={styles.descripcion}>
                    <strong>Descripción:</strong><br />
                    {tratamiento.descripcion}
                  </div>
                )}
               <button
                  style={styles.evolucionesButton}
                  onClick={() => toggleEvoluciones(tratamiento.id)}
                >
                  {expandedTratamientoId === tratamiento.id ? ' Ocultar Evoluciones' : ' Ver Historial de Evoluciones'}
                </button>

                {expandedTratamientoId === tratamiento.id && (
                  <div style={styles.evolucionesSection}>
                    <EvolucionForm 
                      tratamientoId={tratamiento.id} 
                      onEvolucionAgregada={() => {
                        setEvolucionUpdateTrigger(prev => prev + 1);
                        setEditingEvolucion(null);
                      }}
                      evolucionAEditar={editingEvolucion}
                      onCancelEdit={() => setEditingEvolucion(null)}
                    />
                    <EvolucionList 
                      tratamientoId={tratamiento.id} 
                      key={evolucionUpdateTrigger}
                      onEdit={(evo) => setEditingEvolucion(evo)}
                    />
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {/* Modal de modificación */}
      {editingTratamiento && (
        <div style={styles.modal} onClick={handleCancelModificacion}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              Modificar Tratamiento
            </h3>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Nombre del Tratamiento *</label>
              <input
                type="text"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditFormChange}
                style={styles.modalInput}
                placeholder="Nombre del tratamiento"
                required
              />
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Descripción *</label>
              <textarea
                name="descripcion"
                value={editForm.descripcion}
                onChange={handleEditFormChange}
                style={{...styles.modalInput, minHeight: "80px", resize: "vertical"}}
                placeholder="Descripción del tratamiento"
                required
              />
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Estado *</label>
              <select
                name="estado"
                value={editForm.estado}
                onChange={handleEditFormChange}
                style={styles.modalSelect}
                required
              >
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Fecha de Inicio *</label>
              <input
                type="date"
                name="fecha_inicio"
                value={editForm.fecha_inicio}
                onChange={handleEditFormChange}
                style={styles.modalInput}
                required
              />
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Fecha de Fin (opcional)</label>
              <input
                type="date"
                name="fecha_fin"
                value={editForm.fecha_fin}
                onChange={handleEditFormChange}
                style={styles.modalInput}
              />
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Duración Estimada (meses) *</label>
              <input
                type="number"
                name="duracion_estimada"
                value={editForm.duracion_estimada}
                onChange={handleEditFormChange}
                style={styles.modalInput}
                placeholder="Ej: 6, 12, 24"
                min="1"
                required
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                style={{...styles.modalButton, ...styles.cancelButton}}
                onClick={handleCancelModificacion}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#4b5563"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#6b7280"}
              >
                Cancelar
              </button>
              <button
                style={{...styles.modalButton, ...styles.saveButton}}
                onClick={handleSaveModificacion}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
