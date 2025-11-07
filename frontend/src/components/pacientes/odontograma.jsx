import React, { useState, useEffect } from "react";
import { odontogramaAPI } from "../../services/api";
import "./odontograma.css";

const diagnosticos = [
  { nombre: "Sano", color: "#ffffff", codigo: "blanco" },
  { nombre: "Caries", color: "#e53935", codigo: "rojo" },
  { nombre: "Sellante", color: "#2e7d32", codigo: "verde" },
  { nombre: "Amalgama", color: "#9e9e9e", codigo: "gris" },
  { nombre: "Composite", color: "#1e88e5", codigo: "azul" },
  { nombre: "Extracción Indicada", color: "#000000", codigo: "negro" },
];

// Mapeo de superficies del frontend al backend
const SUPERFICIE_MAPPING = {
  centro: 1,   // Oclusal/Incisal
  izquierda: 2, // Mesial
  derecha: 3,   // Distal
  arriba: 4,    // Vestibular
  abajo: 5      // Lingual
};

// IDs de dientes - movido fuera del componente para evitar re-renderizado
const dientesIds = [
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];

export default function Odontograma({ pacienteId }) {

  const [seleccionado, setSeleccionado] = useState("Sano");
  const [odontograma, setOdontograma] = useState(null);
  const [dientes, setDientes] = useState(() => {
    // Inicializar todos los dientes como "sanos"
    const obj = {};
    dientesIds.flat().forEach((id) => {
      obj[id] = {
        arriba: "Sano",
        abajo: "Sano", 
        izquierda: "Sano",
        derecha: "Sano",
        centro: "Sano",
      };
    });
    return obj;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar odontograma del paciente
  useEffect(() => {
    const loadOdontograma = async () => {
      if (!pacienteId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await odontogramaAPI.getByPatient(pacienteId);
        setOdontograma(data);
        
        // Convertir datos del backend al formato del frontend
        const nuevosEstados = {};
        dientesIds.flat().forEach((fdi) => {
          const estadosDiente = odontogramaAPI.getDienteEstados(data, fdi);
          nuevosEstados[fdi] = {
            centro: getEstadoNombrePorCodigo(estadosDiente[1]),   // Oclusal
            izquierda: getEstadoNombrePorCodigo(estadosDiente[2]), // Mesial  
            derecha: getEstadoNombrePorCodigo(estadosDiente[3]),   // Distal
            arriba: getEstadoNombrePorCodigo(estadosDiente[4]),    // Vestibular
            abajo: getEstadoNombrePorCodigo(estadosDiente[5])      // Lingual
          };
        });
        
        setDientes(nuevosEstados);
      } catch (err) {
        console.error('Error al cargar odontograma:', err);
        setError('Error al cargar odontograma: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOdontograma();
  }, [pacienteId]);

  // Función para obtener nombre del estado por código de color
  const getEstadoNombrePorCodigo = (codigo) => {
    const diagnostico = diagnosticos.find(d => d.codigo === codigo);
    return diagnostico ? diagnostico.nombre : "Sano";
  };

  // Función para obtener código de color por nombre del estado
  const getCodigoPorEstado = (nombre) => {
    const diagnostico = diagnosticos.find(d => d.nombre === nombre);
    return diagnostico ? diagnostico.codigo : "blanco";
  };

  // Guardar cambios en el backend
  const guardarCambios = async () => {
    if (!pacienteId || !odontograma) return;

    try {
      setSaving(true);
      
      // Convertir estados del frontend al formato del backend
      const datosModificados = [];
      
      Object.keys(dientes).forEach(fdi => {
        const dienteEstados = dientes[fdi];
        
        Object.keys(SUPERFICIE_MAPPING).forEach(zona => {
          const superficie = SUPERFICIE_MAPPING[zona];
          const estado = dienteEstados[zona];
          const codigo = getCodigoPorEstado(estado);
          
          // Solo agregar si NO es sano (blanco)
          if (codigo !== 'blanco') {
            datosModificados.push({
              fdi: parseInt(fdi),
              superficie: superficie,
              color_codigo: codigo
            });
          }
        });
      });

      await odontogramaAPI.save(pacienteId, datosModificados);
      
      // Recargar odontograma actualizado
      const dataActualizada = await odontogramaAPI.getByPatient(pacienteId);
      setOdontograma(dataActualizada);
      
    } catch (err) {
      console.error('Error al guardar odontograma:', err);
      setError('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const cambiarZona = async (id, zona) => {
    // Cambiar estado local inmediatamente para UX responsiva
    setDientes((prev) => {
      const copia = { ...prev };
      const diente = { ...copia[id] };
      
      // Si ya está seleccionado, volver a sano, sino aplicar el seleccionado
      diente[zona] = diente[zona] === seleccionado ? "Sano" : seleccionado;
      copia[id] = diente;
      return copia;
    });

    // Guardar cambio individual en el backend
    if (pacienteId && odontograma) {
      try {
        const nuevoEstado = dientes[id]?.[zona] === seleccionado ? "Sano" : seleccionado;
        const superficie = SUPERFICIE_MAPPING[zona];
        const codigo = getCodigoPorEstado(nuevoEstado);

        if (codigo === 'blanco') {
          // Si vuelve a sano, necesitamos reconstruir y guardar todo 
          // (para eliminar este registro específico)
          setTimeout(guardarCambios, 100); // Pequeño delay para que se actualice el estado
        } else {
          // Actualizar superficie específica
          await odontogramaAPI.updateSuperficie(odontograma.id, parseInt(id), superficie, codigo);
        }
      } catch (err) {
        console.error('Error al actualizar superficie:', err);
        setError('Error al actualizar: ' + err.message);
      }
    }
  };

  const colorZona = (id, zona) => {
    const nombre = dientes[id]?.[zona];
    const diag = diagnosticos.find((d) => d.nombre === nombre);
    return diag ? diag.color : "#ffffff";
  };

  const resetearDiente = async (id) => {
    if (!pacienteId) return;
    
    try {
      // Resetear localmente
      setDientes(prev => ({
        ...prev,
        [id]: {
          arriba: "Sano",
          abajo: "Sano",
          izquierda: "Sano", 
          derecha: "Sano",
          centro: "Sano"
        }
      }));

      // Resetear en backend
      await odontogramaAPI.resetDiente(pacienteId, parseInt(id));
      
    } catch (err) {
      console.error('Error al resetear diente:', err);
      setError('Error al resetear diente: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="odontograma">
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Cargando odontograma...
        </div>
      </div>
    );
  }

  return (
    <div className="odontograma">
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px',
          color: '#dc2626',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <aside className="panel">
        <h3>Seleccione diagnóstico</h3>
        {diagnosticos.map((d) => (
          <label
            key={d.nombre}
            className={`opcion ${seleccionado === d.nombre ? "activo" : ""}`}
          >
            <input
              type="radio"
              name="diag"
              checked={seleccionado === d.nombre}
              onChange={() => setSeleccionado(d.nombre)}
            />
            <span
              className="color"
              style={{ backgroundColor: d.color }}
            ></span>
            {d.nombre}
          </label>
        ))}
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
          <button
            onClick={guardarCambios}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              width: '100%',
              marginBottom: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0px)';
              }
            }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <small style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            display: 'block', 
            textAlign: 'center',
            lineHeight: '1.4',
            fontStyle: 'italic'
          }}>
            Los cambios se guardan automáticamente al hacer clic en cada superficie
          </small>
        </div>
      </aside>

      <main className="mapa">
        {dientesIds.map((fila, i) => (
          <div key={i} className="arcada-container">
            <div className="arcada-label">
              {i === 0 ? 'Arcada Superior' : 'Arcada Inferior'}
            </div>
            <div className="fila">
              {fila.map((id) => (
                <div key={id} className="diente" style={{ position: 'relative' }}>
                  <div
                    className="sector arriba"
                    style={{ backgroundColor: colorZona(id, "arriba") }}
                    onClick={() => cambiarZona(id, "arriba")}
                    title={`Diente ${id} - Vestibular: ${dientes[id]?.arriba}`}
                  ></div>
                  <div
                    className="sector abajo"
                    style={{ backgroundColor: colorZona(id, "abajo") }}
                    onClick={() => cambiarZona(id, "abajo")}
                    title={`Diente ${id} - Lingual: ${dientes[id]?.abajo}`}
                  ></div>
                  <div
                    className="sector izquierda"
                    style={{ backgroundColor: colorZona(id, "izquierda") }}
                    onClick={() => cambiarZona(id, "izquierda")}
                    title={`Diente ${id} - Mesial: ${dientes[id]?.izquierda}`}
                  ></div>
                  <div
                    className="sector derecha"
                    style={{ backgroundColor: colorZona(id, "derecha") }}
                    onClick={() => cambiarZona(id, "derecha")}
                    title={`Diente ${id} - Distal: ${dientes[id]?.derecha}`}
                  ></div>
                  <div
                    className="sector centro"
                    style={{ backgroundColor: colorZona(id, "centro") }}
                    onClick={() => cambiarZona(id, "centro")}
                    title={`Diente ${id} - Oclusal: ${dientes[id]?.centro}`}
                  >
                    {id}
                  </div>
                  
                  {/* Botón para resetear diente */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetearDiente(id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#4b5563',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      opacity: '0.7',
                      transition: 'all 0.2s ease',
                      lineHeight: '1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.color = '#dc2626';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.7';
                      e.target.style.color = '#4b5563';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={`Resetear diente ${id} a sano`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
