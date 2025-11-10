import React, { useState, useEffect } from 'react';

const EvolucionForm = ({ tratamientoId, onEvolucionAgregada, evolucionAEditar, onCancelEdit }) => {
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    if (evolucionAEditar) {
      setDescripcion(evolucionAEditar.descripcion);
      setImagenPreview(evolucionAEditar.imagen);
      setImagen(null);
    } else {
      resetForm();
    }
  }, [evolucionAEditar]);

  const resetForm = () => {
    setDescripcion('');
    setImagen(null);
    setImagenPreview(null);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert('Por favor, escribe una descripción.');
      return;
    }

    setCargando(true);

    const formData = new FormData();
    formData.append('tratamiento', tratamientoId);
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    const url = evolucionAEditar
      ? `http://127.0.0.1:8000/api/evoluciones/${evolucionAEditar.id}/`
      : 'http://127.0.0.1:8000/api/evoluciones/';
    
    const method = evolucionAEditar ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (response.ok) {
        resetForm();
        if (onEvolucionAgregada) onEvolucionAgregada();
        if (evolucionAEditar && onCancelEdit) onCancelEdit();
      } else {
        alert('Error al guardar la evolución.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  const styles = {
    form: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: evolucionAEditar ? '#fff7ed' : '#f8fafc',
      borderRadius: '8px',
      border: evolucionAEditar ? '2px solid #f59e0b' : '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    formTitle: {
      marginTop: 0,
      marginBottom: '15px',
      color: evolucionAEditar ? '#d97706' : '#2d3748',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#4a5568' },
    textarea: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #cbd5e0',
      minHeight: '80px',
      fontFamily: 'inherit'
    },
    fileInput: { marginTop: '5px' },
    previewContainer: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px dashed #cbd5e0',
      borderRadius: '4px',
      display: 'inline-block'
    },
    previewImage: { maxWidth: '100px', maxHeight: '100px', display: 'block' },
    previewLabel: { fontSize: '0.8em', color: '#718096', marginBottom: '5px' },
    buttonGroup: { display: 'flex', gap: '10px' },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      color: 'white',
      flex: 1
    },
    submitBtn: { backgroundColor: evolucionAEditar ? '#f59e0b' : '#4299e1' },
    cancelBtn: { backgroundColor: '#9ca3af' }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4 style={styles.formTitle}>
        {evolucionAEditar ? ' Modificando Evolución' : ' Agregar Nueva Evolución'}
      </h4>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Descripción:</label>
        <textarea
          style={styles.textarea}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe el progreso del tratamiento..."
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          {evolucionAEditar ? 'Cambiar Imagen (Opcional):' : 'Imagen (Opcional):'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          style={styles.fileInput}
        />
        {imagenPreview && !imagen && (
          <div style={styles.previewContainer}>
            <div style={styles.previewLabel}>Imagen actual:</div>
            <img src={imagenPreview.startsWith('http') ? imagenPreview : `http://127.0.0.1:8000${imagenPreview}`} alt="Actual" style={styles.previewImage} />
          </div>
        )}
      </div>

      <div style={styles.buttonGroup}>
        {evolucionAEditar && (
          <button 
            type="button"
            onClick={handleCancel}
            style={{...styles.button, ...styles.cancelBtn}}
            disabled={cargando}
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          style={{...styles.button, ...styles.submitBtn, opacity: cargando ? 0.7 : 1}}
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : (evolucionAEditar ? 'Guardar Cambios' : 'Guardar Evolución')}
        </button>
      </div>
    </form>
  );
};

export default EvolucionForm;