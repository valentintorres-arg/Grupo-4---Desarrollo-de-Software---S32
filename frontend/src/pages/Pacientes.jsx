import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalAgregarAntecedente from "../components/pacientes/modal-agregar-antecedente";
import Tratamientos from "../components/tratamiento/tratamientos";
import Antecedentes from "../components/pacientes/antecedentes";
import Consultas from "../components/pacientes/consultas";
import Odontograma from "../components/pacientes/odontograma";

const Field = React.memo(({ label, type = "text", value, onChange, disabled }) => {
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
      <input type={type} value={value} onChange={onChange} style={s.input} disabled={disabled} />
    </div>
  );
});

export default function PerfilPaciente() {
  const navigate = useNavigate();
  const location = useLocation();
  const pacienteDesdeLista = location.state?.patient;

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

  useEffect(() => {
    localStorage.setItem("antecedentes", JSON.stringify(antecedentes));
  }, [antecedentes]);

  const [paciente, setPaciente] = useState(
    pacienteDesdeLista || {
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

  const [draft, setDraft] = useState({ ...paciente });
  const [editando, setEditando] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("personal");

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const handleEditar = () => setEditando(true);
  const handleCancelar = () => {
    setDraft({ ...paciente });
    setEditando(false);
  };
  const handleGuardar = () => {
    setPaciente({ ...draft });
    setEditando(false);
  };

  const actualizarCampo = (campo, valor) => {
    setDraft((prev) => ({ ...prev, [campo]: valor }));
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
      top: 30,
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

  const tabs = [
    { id: "personal", label: "Datos personales" },
    { id: "odontograma", label: "Odontograma" },
    { id: "antecedentes", label: "Antecedentes" },
    { id: "tratamientos", label: "Tratamientos" },
    { id: "consultas", label: "Consultas" },
  ];

  return (
    <div style={s.page}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/pacientes")}>
          ← Volver
        </button>
        <div style={s.headerInfo}>
          <div style={s.avatar}>
            {paciente.genero === "Masculino" ? "👨" : "👩"}
          </div>
          <div>
            <h2 style={s.name}>
              {paciente.nombre} {paciente.apellido}
            </h2>
            <p style={s.age}>{calcularEdad(paciente.fechaNacimiento)} años</p>
          </div>
        </div>
      </header>

      <div style={s.tabsBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSeccionActiva(tab.id)}
            style={{
              ...s.tab,
              ...(seccionActiva === tab.id ? s.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section style={s.section}>
        {seccionActiva === "personal" && (
          <>
            <div style={s.grid}>
              <Field label="Nombre" value={draft.nombre} onChange={(e) => actualizarCampo("nombre", e.target.value)} disabled={!editando} />
              <Field label="Apellido" value={draft.apellido} onChange={(e) => actualizarCampo("apellido", e.target.value)} disabled={!editando} />
              <Field label="DNI" value={draft.dni} onChange={(e) => actualizarCampo("dni", e.target.value)} disabled={!editando} />
              <Field label="Fecha de nacimiento" type="date" value={draft.fechaNacimiento} onChange={(e) => actualizarCampo("fechaNacimiento", e.target.value)} disabled={!editando} />
              <Field label="Teléfono" value={draft.telefono} onChange={(e) => actualizarCampo("telefono", e.target.value)} disabled={!editando} />
              <Field label="Email" type="email" value={draft.email} onChange={(e) => actualizarCampo("email", e.target.value)} disabled={!editando} />
              <Field label="Obra Social" value={draft.obraSocial} onChange={(e) => actualizarCampo("obraSocial", e.target.value)} disabled={!editando} />
              <Field label="Dirección" value={draft.direccion} onChange={(e) => actualizarCampo("direccion", e.target.value)} disabled={!editando} />
              <Field label="Género" value={draft.genero} onChange={(e) => actualizarCampo("genero", e.target.value)} disabled={!editando} />
            </div>

            {!editando && <button style={s.fabEdit} onClick={handleEditar}>Editar</button>}
            {editando && (
              <div style={s.actions}>
                <button style={{ ...s.btn, ...s.btnCancel }} onClick={handleCancelar}>
                  Cancelar
                </button>
                <button style={{ ...s.btn, ...s.btnSave }} onClick={handleGuardar}>
                  Guardar cambios
                </button>
              </div>
            )}
          </>
        )}

        {seccionActiva === "odontograma" && <Odontograma />}
        {seccionActiva === "antecedentes" && (
          <>
            <Antecedentes />
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
        {seccionActiva === "tratamientos" && <Tratamientos />}
        {seccionActiva === "consultas" && <Consultas />}
      </section>
    </div>
  );
}
