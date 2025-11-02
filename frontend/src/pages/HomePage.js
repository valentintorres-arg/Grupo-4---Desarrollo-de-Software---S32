// import { useNavigate } from "react-router-dom";

// export default function HomePage() {
//   const navigate = useNavigate();

//   const styles = {
//     container: "flex flex-col items-center mt-20 text-gray-700",
//     titulo: "text-3xl font-bold",
//     subtitulo: "mt-4 mb-8",
//     boton: "px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200",
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.titulo}>Bienvenido a OdontoSys</h2>
//       <p className={styles.subtitulo}>Seleccione una opción del menú</p>

//       <button
//         onClick={() => navigate("/login")}
//         className={styles.boton}
//       >
//         Iniciar Sesión
//       </button>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, getUserData, getAuthHeaders } from "../utils/auth";

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const userData = getUserData();
  const [ odontologoInfo, setOdontologoInfo ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const styles = {
    container: {
      width: "100%",
      minHeight: "calc(100vh - 80px)", // deja espacio para la navbar fija
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
    subtituloSecundario: {
      fontSize: "1rem",
      color: "#64748b",
      marginBottom: "20px",
    },
  };

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      fetch('http://localhost:8000/odontologos/perfil/', {
        method: 'GET',
        headers: getAuthHeaders()
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al obtener perfil');
      })
      .then(data => {
        setOdontologoInfo(data);
        console.log('Perfil Obtenido:', data);
      })
      .catch(error => {
        console.error('Error obteniendo perfil:', error);
        setOdontologoInfo({nombre_completo: `Matricula ${userData.matricula}`});
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [isLoggedIn, userData.matricula]);

  const handleHover = (e, isHovering) => {
    Object.assign(e.target.style, isHovering ? styles.botonHover : {});
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Bienvenido a OdontoSys 🦷</h2>

      {isLoggedIn ? (
        <>
          <p style={styles.subtitulo}>
            {loading ? (
              '¡Hola Doctor! Cargando...'
            ) : (
              `¡Hola Dr/Dra. ${odontologoInfo?.nombre_completo || userData.matricula}!`
            )}
          </p>
          <p style={styles.subtituloSecundario}>
            Selecciona una opción del menú para continuar
          </p>
        </>
      ) : (
        <>
          <p style={styles.subtitulo}>Seleccione una opción del menú</p>
          <button
            style={styles.boton}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </>
      )}
      
    </div>
  );
}

