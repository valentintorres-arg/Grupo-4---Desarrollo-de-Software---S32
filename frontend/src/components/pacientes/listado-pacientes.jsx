import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientsListPage() {
  const navigate = useNavigate();

  const patients = [
    { id: "000001", nombre: "Jonathan", apellido: "Santurio", dni: "9797979797", email: "elño@gmail.com", telefono: "+54 221 98989898" },
    { id: "000002", nombre: "Camila", apellido: "Martínez", dni: "40888999", email: "camila.martinez@gmail.com", telefono: "+54 11 22223333" },
    { id: "000003", nombre: "Diego", apellido: "Gómez", dni: "36777111", email: "dgomez@gmail.com", telefono: "+54 221 44445555" },
    { id: "000004", nombre: "Lucía", apellido: "Pérez", dni: "40999111", email: "lucia.perez@gmail.com", telefono: "+54 11 55556666" },
  ];

  const [query, setQuery] = useState("");

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.dni.toLowerCase().includes(q) ||
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
      padding: "140px 20px 10px",
      
   
      
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "10px",
      
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
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Listado de Pacientes</h2>

    
      <div style={s.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, DNI o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={s.searchInput}
        />
        <button
          style={s.addButton}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, {
              backgroundColor: "#1e40af",
              transform: "scale(1.03)",
            })
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              backgroundColor: "#2563eb",
              transform: "scale(1)",
            })
          }
          onClick={() => navigate("/patients/new")}
        >
          ➕ Nuevo Paciente
        </button>
      </div>

 
      <div style={s.list}>
        {filtered.length > 0 ? (
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
                </div>
              </div>
              <div style={{ fontSize: 24 }}>🦷</div>
            </div>
          ))
        ) : (
          <div style={s.empty}>No se encontraron pacientes.</div>
        )}
      </div>
    </div>
  );
}
