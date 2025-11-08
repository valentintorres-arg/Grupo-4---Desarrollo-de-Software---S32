import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../../hooks/usePatients";

export default function PatientsListPage() {
  const navigate = useNavigate();
  const { patients, loading, error, setError } = usePatients();
  const [query, setQuery] = useState("");

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.dni.toString().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const s = {
    page: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      color: "#111827",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "90px 20px 40px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "20px",
      marginTop:"30px",
    },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      maxWidth: "600px",
      marginBottom: "30px",
    },
    searchInput: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: 12,
      border: "1px solid #d1d5db",
      fontSize: 16,
      outline: "none",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    addButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "12px 10px",
      fontSize: 15,
      fontWeight: 500,
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
    },
    list: {
      width: "100%",
      maxWidth: 800,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: "1px solid #e5e7eb",
      cursor: "pointer",
      transition: "all .2s ease",
    },
    name: {
      fontSize: 17,
      fontWeight: 600,
      color: "#111",
    },
    info: {
      fontSize: 14,
      color: "#555",
    },
    empty: {
      padding: "20px",
      textAlign: "center",
      color: "#6b7280",
    },
    loading: {
      padding: "40px",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "16px",
    },
    error: {
      padding: "20px",
      textAlign: "center",
      color: "#dc2626",
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      marginBottom: "20px",
      maxWidth: "800px",
      width: "100%",
    },
    retryButton: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Listado de Pacientes</h2>

      {/* Mostar error si existe*/}
      {error && (
        <div style={s.error}>
          {error}
          <br />
          <button
            style={s.retryButton}
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* 🔎 Barra de búsqueda + botón */}
      <div style={s.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, DNI o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={s.searchInput}
          disabled={loading}
        />
        <button
          style={{
            ...s.addButton,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              Object.assign(e.currentTarget.style, {
                backgroundColor: "#1e40af",
                transform: "scale(1.03)",
              });
            }
          }}
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              backgroundColor: "#2563eb",
              transform: "scale(1)",
            })
          }
          onClick={() => navigate("/patients/new")}
          disabled={loading}
        >
          ➕ Nuevo Paciente
        </button>
      </div>

      {/* 📋 Lista */}
      <div style={s.list}>
        {loading ? (
          <div style={s.loading}>
            Cargando pacientes...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((p) => (
            <div
              key={p.id}
              style={s.row}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#fff")
              }
              onClick={() =>
                navigate(`/patients/${p.id}`, { state: { patient: p } })
              }
            >
              <div>
                <div style={s.name}>
                  {p.nombre} {p.apellido}
                </div>
                <div style={s.info}>
                  DNI: {p.dni} • {p.email}
                  {p.obraSocial_data && (
                    <span> • {p.obraSocial_data.nombre}</span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 24 }}>🦷</div>
            </div>
          ))
        ) : (
          <div style={s.empty}>
            {patients.length === 0 ? "No hay pacientes registrados." : "No se encontraron pacientes."}
          </div>
        )}
      </div>
    </div>
  );
}
