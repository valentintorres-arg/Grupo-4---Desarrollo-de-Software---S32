

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const styles = {
    container: {
      width: "100%",
      minHeight: "calc(100vh - 80px)", 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      color: "#0f172a",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      background:
        "radial-gradient(800px 400px at 20% 10%, rgba(99,102,241,.05), transparent 60%), radial-gradient(700px 400px at 80% 0%, rgba(168,85,247,.07), transparent 60%), #ffffff",
      textAlign: "center",
      padding: "32px",
    },
    titulo: {
      fontSize: "2.2rem",
      fontWeight: "700",
      marginBottom: "16px",
      background:
        "linear-gradient(120deg, #6d28d9 0%, #3b82f6 60%, #22d3ee 120%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitulo: {
      fontSize: "1.1rem",
      color: "#475569",
      marginBottom: "40px",
    },
    boton: {
      padding: "12px 28px",
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      background:
        "linear-gradient(135deg, #7c3aed, #2563eb)",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.25s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    botonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    },
  };

  const handleHover = (e, isHovering) => {
    Object.assign(e.target.style, isHovering ? styles.botonHover : {});
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Bienvenido a OdontoSys 🦷</h2>
      <p style={styles.subtitulo}>Seleccione una opción del menú</p>

      <button
        style={styles.boton}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        onClick={() => navigate("/login")}
      >
        Iniciar Sesión
      </button>
    </div>
  );
}

