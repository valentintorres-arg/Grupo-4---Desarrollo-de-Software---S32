//===================================V3 BELOW=======================================
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalAgregarAntecedente from "../components/componentspacieantes/Modal-agregar-antecedente";
import Tratamientos from "../components/componentspacieantes/Tratamientos";
import Antecedentes from "../components/componentspacieantes/Antecedentes";
<<<<<<< HEAD
import Consultas from "../components/componentspacieantes/consultas";
=======
import Odontograma from "../components/componentspacieantes/Odontograma.tsx";
>>>>>>> a63ebf5 (odontograma 120%)



// 🔹 Definimos Field fuera del componente principal
const Field = React.memo(({ label, field, type = "text", value, onChange, disabled }) => {
  const s = {
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 13, fontWeight: 700, color: "#6b7280" },
    input: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #d1d5db",
      fontSize: 15,
      backgroundColor: disabled ? "#f3f4f6" : "#fff",
      color: disabled ? "#6b7280" : "#000",
      outline: "none",
    },
  };
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={s.input}
        disabled={disabled}
      />
    </div>
  );
});

export default function PatientProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientFromList = location.state?.patient;


// 💾 Recuperar los antecedentes guardados o inicializar con genéricos
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

const [mostrarModal, setMostrarModal] = useState(false);

// 🧠 Guardar en LocalStorage cada vez que cambia la lista
useEffect(() => {
  localStorage.setItem("antecedentes", JSON.stringify(antecedentes));
}, [antecedentes]);


  const [patientData, setPatientData] = useState(
    patientFromList || {
      id: "000000",
      nombre: "Paciente",
      apellido: "Desconocido",
      fechaNacimiento: "2000-01-01",
      telefono: "-",
      email: "-",
      obraSocial: "-",
      genero: "Masculino",
      dni: "-",
      direccion: "-",
    }
  );

  const [draft, setDraft] = useState({ ...patientData });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setDraft({ ...patientData });
    setIsEditing(false);
  };
  const handleSave = () => {
    setPatientData({ ...draft });
    setIsEditing(false);
  };

  // 🔧 clave: no crear nuevo objeto cada letra
  const handleFieldUpdate = (field, value) => {
    draft[field] = value;
    setDraft({ ...draft });
  };

  const s = {
    page: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      backgroundColor: "#fff",
      color: "#111827",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingBottom: 40,
      position: "relative",
      color: "#fff",
      marginTop: "70px",
      zIndex: 5,
    },
    backBtn: {
      position: "absolute",
      top: 16,
      left: 20,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.35)",
      color: "#fff",
      borderRadius: 9999,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 14,
      transition: "all .2s ease",
      backdropFilter: "blur(4px)",
      zIndex: 10,
    },
    headerInfo: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "80px 5vw 20px 5vw",
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 60,
    },
    name: { fontSize: 28, fontWeight: 700, margin: 0, color: "#fff" },
    age: { marginTop: 6, fontSize: 16, fontWeight: 500, color: "#fff" },
    tabsBar: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      padding: 10,
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
      margin: "16px 5vw",
    },
    tab: {
      padding: "10px 20px",
      borderRadius: 10,
      border: "none",
      background: "transparent",
      color: "#666",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all .2s ease",
    },
    tabActive: { background: "#667eea", color: "#fff", fontWeight: 600 },
    section: {
      background: "#f9fafb",
      flex: 1,
      padding: "32px 5vw 90px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px 40px",
      marginTop: 20,
    },
    actions: {
      position: "sticky",
      bottom: 0,
      width: "100%",
      background: "#f9fafb",
      borderTop: "1px solid #e5e7eb",
      padding: "16px 5vw",
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      zIndex: 10,
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
    fabEdit: {
      position: "fixed",
      bottom: 32,
      right: 32,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 9999,
      padding: "14px 24px",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 6px 14px rgba(118,75,162,0.3)",
      transition: "transform .2s ease, box-shadow .2s ease",
      zIndex: 20,
    },
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/patients")}>
          ← Volver
        </button>
        <div style={s.headerInfo}>
          <div style={s.avatar}>
            {patientData.genero === "Masculino" ? "👨" : "👩"}
          </div>
          <div>
            <h2 style={s.name}>
              {patientData.nombre} {patientData.apellido}
            </h2>
            <p style={s.age}>{calculateAge(patientData.fechaNacimiento)} años</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={s.tabsBar}>
        {["personal", "odontograma", "antecedentes", "turnos", "tratamientos", "consultas"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            style={{ ...s.tab, ...(activeSection === tab ? s.tabActive : {}) }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <section style={s.section}>
        {activeSection === "personal" && (
          <>
            <div style={s.grid}>
              <Field label="Nombre" value={draft.nombre} onChange={(e) => handleFieldUpdate("nombre", e.target.value)} disabled={!isEditing} />
              <Field label="Apellido" value={draft.apellido} onChange={(e) => handleFieldUpdate("apellido", e.target.value)} disabled={!isEditing} />
              <Field label="DNI" value={draft.dni} onChange={(e) => handleFieldUpdate("dni", e.target.value)} disabled={!isEditing} />
              <Field label="Fecha de nacimiento" type="date" value={draft.fechaNacimiento} onChange={(e) => handleFieldUpdate("fechaNacimiento", e.target.value)} disabled={!isEditing} />
              <Field label="Teléfono" value={draft.telefono} onChange={(e) => handleFieldUpdate("telefono", e.target.value)} disabled={!isEditing} />
              <Field label="Email" type="email" value={draft.email} onChange={(e) => handleFieldUpdate("email", e.target.value)} disabled={!isEditing} />
              <Field label="Obra Social" value={draft.obraSocial} onChange={(e) => handleFieldUpdate("obraSocial", e.target.value)} disabled={!isEditing} />
              <Field label="Dirección" value={draft.direccion} onChange={(e) => handleFieldUpdate("direccion", e.target.value)} disabled={!isEditing} />
              <Field label="Género" value={draft.genero} onChange={(e) => handleFieldUpdate("genero", e.target.value)} disabled={!isEditing} />
            </div>

            {isEditing && (
              <div style={s.actions}>
                <button style={{ ...s.btn, ...s.btnCancel }} onClick={handleCancel}>
                  Cancelar
                </button>
                <button style={{ ...s.btn, ...s.btnSave }} onClick={handleSave}>
                  Guardar cambios
                </button>
              </div>
            )}
          </>
        )}

        {activeSection === "odontograma" && <Odontograma />}

        {activeSection === "antecedentes" && (
          <>
            <Antecedentes />
            {/* Este modal te permite agregar las entradas de antecedentes, cada vez que haya un hito en la vida medica del paciente. */}
            <ModalAgregarAntecedente
              isOpen={mostrarModal}
              onClose={() => setMostrarModal(false)}
              onAdd={(nuevo) => {
                const nuevaLista = [{ id: Date.now(), ...nuevo }, ...antecedentes];
                setAntecedentes(nuevaLista);
              }}
            />
          </>
        )}
        {activeSection === "turnos" && <p>Turnos del paciente (en construcción)</p>}


        {activeSection === "tratamientos" && (
          <Tratamientos />
        )}

        {activeSection === "consultas" && (
          <Consultas />



        )}
      </section>
      


      {!isEditing && (
        <button style={s.fabEdit} onClick={handleEdit}>
          ✏️ Editar
        </button>
      )}
    </div>
  );
}
