// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const styles = {
//     nav: "bg-blue-600 text-white p-4 flex justify-between items-center shadow",
//     title: "text-2xl font-bold",
//     buttonContainer: "flex gap-4",
//     button: "px-3 py-2 rounded hover:bg-blue-700 transition",
//   };

//   return (
//     <nav className={styles.nav}>
//       <h1 className={styles.title}>OdontoSys 🦷</h1>
//       <div className={styles.buttonContainer}>
//         <button className={styles.button} onClick={() => navigate("/")}>
//           Home
//         </button>
//         <button className={styles.button} onClick={() => navigate("/patients")}>
//           Pacientes
//         </button>
//         <button className={styles.button} onClick={() => navigate("/patients/new")}>
//           Nuevo Paciente
//         </button>
//         <button className={styles.button} onClick={() => navigate("/register")}>
//           Registrar Tratamiento
//         </button>
//       </div>
//     </nav>
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const styles = {
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background:
        "linear-gradient(120deg, #6d28d9 0%, #3b82f6 60%, #22d3ee 120%)",
      color: "white",
      padding: "20px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 10,
      boxSizing: "border-box",
    },
    title: {
      fontSize: "22px",
      fontWeight: "700",
    },
    navButtons: {
      display: "flex",
      gap: "16px",
    },
    btn: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(148,163,184,.25)",
      background: "#0e1a3a",
      color: "#e2e8f0",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    btnHover: {
      background: "#1e293b",
    },
    btnPrimary: {
      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
      borderColor: "transparent",
      color: "white",
    },
  };

  // manejador para efectos hover sin CSS externo
  const handleHover = (e, isHovering) => {
    Object.assign(
      e.target.style,
      isHovering ? styles.btnHover : { background: "#0e1a3a" }
    );
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>OdontoSys 🦷</h1>
      <div style={styles.navButtons}>
        <button
          style={styles.btn}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          style={styles.btn}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={() => navigate("/patients")}
        >
          Pacientes
        </button>
        <button
          style={styles.btn}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={() => navigate("/patients/new")}
        >
          Nuevo Paciente
        </button>
        <button
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={() => navigate("/register")}
        >
          Registrar Tratamiento
        </button>
      </div>
    </header>
  );
}
