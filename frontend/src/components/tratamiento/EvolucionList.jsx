import React, { useEffect, useState } from 'react';

const EvolucionList = ({ tratamientoId, onEdit }) => {
  const [evoluciones, setEvoluciones] = useState([]);

  const fetchEvoluciones = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/evoluciones/?tratamiento=${tratamientoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEvoluciones(data);
      }
    } catch (error) {
      console.error("Error cargando evoluciones:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta evolución?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/evoluciones/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        setEvoluciones(prev => prev.filter(evo => evo.id !== id));
      } else {
        alert("Error al eliminar la evolución.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión.");
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;
  };

  useEffect(() => {
    if (tratamientoId) {
      fetchEvoluciones();
    }
  }, [tratamientoId]);

  const styles = {
    container: { marginTop: '20px' },
    card: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#fff',
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-start'
    },
    imagenColumn: {
      width: '120px',
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f7fafc',
      borderRadius: '6px',
      minHeight: '100px'
    },
    imagen: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #cbd5e0',
      cursor: 'zoom-in'
    },
    noImagenPlaceholder: {
      color: '#cbd5e0',
      fontSize: '2rem'
    },
    infoColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    fecha: {
      fontWeight: 'bold',
      color: '#4a5568',
      marginBottom: '8px',
      borderBottom: '1px solid #edf2f7',
      paddingBottom: '5px'
    },
    texto: {
      whiteSpace: 'pre-wrap',
      color: '#2d3748',
      lineHeight: '1.5'
    },
    actionsColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '80px'
    },
    actionBtn: {
      border: 'none',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      textAlign: 'center'
    },
    modificarBtn: {
      backgroundColor: "#f59e0b",
      color: "#fff",
    },
    eliminarBtn: {
      backgroundColor: "#ef4444",
      color: "#fff",
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={{color: '#2d3748', marginBottom: '15px'}}>Historial de Evoluciones</h3>
      {evoluciones.length === 0 ? (
        <p style={{color: '#718096', fontStyle: 'italic'}}>No hay evoluciones registradas.</p>
      ) : (
        evoluciones.map(evo => (
          <div key={evo.id} style={styles.card}>
            
            <div style={styles.imagenColumn}>
              {evo.imagen ? (
                <a href={getImageUrl(evo.imagen)} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={getImageUrl(evo.imagen)} 
                    alt="Evidencia" 
                    style={styles.imagen} 
                    title="Clic para ampliar"
                  />
                </a>
              ) : (
                <span style={styles.noImagenPlaceholder}>📷</span>
              )}
            </div>

            <div style={styles.infoColumn}>
              <div style={styles.fecha}>
                📅 {new Date(evo.fecha).toLocaleString('es-AR', { 
                  day: '2-digit', month: '2-digit', year: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                })} hs
              </div>
              <div style={styles.texto}>{evo.descripcion}</div>
            </div>

            <div style={styles.actionsColumn}>
              <button 
                style={{...styles.actionBtn, ...styles.modificarBtn}}
                onClick={() => onEdit(evo)}
                title="Modificar evolución"
              >
                 Modificar
              </button>
              <button 
                style={{...styles.actionBtn, ...styles.eliminarBtn}}
                onClick={() => handleDelete(evo.id)}
                title="Eliminar evolución"
              >
                Eliminar
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default EvolucionList;