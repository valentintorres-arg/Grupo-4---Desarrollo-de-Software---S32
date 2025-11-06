
import { useState, useEffect } from "react";
import ModalAgregarAntecedente from "./modal-agregar-antecedente"; 

export default function Antecedentes() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [antecedentes, setAntecedentes] = useState(() => {
    const guardados = localStorage.getItem("antecedentes");
    return guardados
      ? JSON.parse(guardados)
      : [
          { id: 1, fecha: "2025-10-01", descripcion: "Dolor en molar superior derecho" },
          { id: 2, fecha: "2025-09-15", descripcion: "Limpieza general y control" },
          { id: 3, fecha: "2025-08-20", descripcion: "Tratamiento de caries en incisivo" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("antecedentes", JSON.stringify(antecedentes));
  }, [antecedentes]);

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
    actions: {
      marginTop: 24,
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
    },
    btn: {
      padding: "10px 18px",
      borderRadius: 9999,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      transition: "all .2s ease",
      border: "none",
    },
    btnCancel: {
      background: "#fff",
      border: "1px solid #cbd5e1",
      color: "#334155",
    },
    btnSave: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(118,75,162,0.3)",
    },
  };

  return (
    <>
      <div style={s.grid}>
        {antecedentes.map((a) => (
          <div key={a.id} style={s.card}>
            <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              📅 {new Date(a.fecha).toLocaleDateString("es-AR")}
            </p>
            <p style={{ fontSize: 16, color: "#111827", lineHeight: 1.5 }}>
              {a.descripcion}
            </p>
          </div>
        ))}

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

      <div style={s.actions}>
        <button
          style={{ ...s.btn, ...s.btnCancel }}
          onClick={() => alert("Volver a información del paciente")}
        >
          Cancelar
        </button>
        <button
          style={{ ...s.btn, ...s.btnSave }}
          onClick={() => alert("Guardar cambios en antecedentes (demo)")}
        >
          Guardar
        </button>
      </div>

      <ModalAgregarAntecedente
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onAdd={(nuevo) => {
          const nuevaLista = [{ id: Date.now(), ...nuevo }, ...antecedentes];
          setAntecedentes(nuevaLista);
        }}
      />
    </>
  );
}
