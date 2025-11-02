// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import logo1 from '../components/icons/logo1.png';

// export default function Login() {
//   const [matricula, setMatricula] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("[v2] Login attempt:", { matricula, password });
//   };

//   const styles = {
//     container: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-6",
//     card: "bg-white rounded-2xl shadow-lg p-12 max-w-md w-full",
//     header: "text-center mb-10",
//     logoContainer: "inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6",
//     logo: "w-full h-full",
//     title: "text-3xl font-bold text-gray-900 mb-2",
//     subtitle: "text-gray-500 text-sm",
//     form: "space-y-6",
//     label: "block text-sm font-semibold text-gray-700 mb-2",
//     input: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
//     passwordContainer: "relative",
//     toggleButton: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700",
//     submitButton: "w-full py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold text-lg hover:shadow-lg transition-all duration-200",
//     dividerContainer: "relative text-center mt-10",
//     dividerText: "bg-white px-4 text-gray-400 text-sm",
//     dividerLine: "absolute left-0 top-1/2 w-full border-t border-gray-200 -z-10",
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.logoContainer}>
//             <img src={logo1} alt="Logo" className={styles.logo} />
//           </div>
//           <h1 className={styles.title}>Iniciar Sesión</h1>
//           <p className={styles.subtitle}>Accede con tu matrícula y contraseña</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className={styles.form}>
//           {/* Matrícula */}
//           <div>
//             <label htmlFor="matricula" className={styles.label}>Matrícula</label>
//             <input
//               id="matricula"
//               type="text"
//               value={matricula}
//               onChange={(e) => setMatricula(e.target.value)}
//               placeholder="Ej: AB12345"
//               required
//               className={styles.input}
//             />
//           </div>

//           {/* Contraseña */}
//           <div>
//             <label htmlFor="password" className={styles.label}>Contraseña</label>
//             <div className={styles.passwordContainer}>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 required
//                 className={styles.input + " pr-12"} // mantiene espacio para el botón
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className={styles.toggleButton}
//                 aria-label="Mostrar/ocultar contraseña"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           {/* Submit */}
//           <button type="submit" className={styles.submitButton}>
//             Iniciar Sesión
//           </button>
//         </form>

//         {/* Divider */}
//         <div className={styles.dividerContainer}>
//           <span className={styles.dividerText}>Grupo 4</span>
//           <div className={styles.dividerLine}></div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo1 from "../components/icons/logo1.png";
import { getUserData } from "../utils/auth";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8000/odontologos/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: matricula,
          password: password,
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_matricula', matricula);

        navigate('/');
        const userData = getUserData();
        console.log('Usuario logueado:', userData.matricula);
      } else {
        setError(data.detail || 'Credenciales incorrectas. Verifica tu matricula y contraseña.')
      }
    } catch(error) {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose');
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg, #6d28d9 0%, #3b82f6 60%, #22d3ee 120%)",
      padding: "32px",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      padding: "48px 40px",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
    },
    header: {
      marginBottom: "32px",
    },
    logoContainer: {
      width: "64px",
      height: "64px",
      borderRadius: "16px",
      margin: "0 auto 20px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "0.95rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      marginTop: "16px",
    },
    label: {
      display: "block",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "0.9rem",
      color: "#334155",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      color: "#0f172a",
      outline: "none",
      transition: "all 0.2s ease",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
    },
    passwordContainer: {
      position: "relative",
    },
    toggleButton: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.1rem",
    },
    submitButton: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
      color: "#fff",
      fontWeight: "600",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "all 0.25s ease",
      boxShadow: "0 6px 14px rgba(59,130,246,0.2)",
      opacity: isLoading ? 0.7 : 1,
      pointerEvents: isLoading ? "none" : "auto",
    },
    submitButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 18px rgba(59,130,246,0.3)",
    },
    dividerContainer: {
      position: "relative",
      marginTop: "40px",
      textAlign: "center",
    },
    dividerText: {
      position: "relative",
      zIndex: 1,
      background: "#fff",
      padding: "0 10px",
      color: "#94a3b8",
      fontSize: "0.9rem",
    },
    dividerLine: {
      position: "absolute",
      left: 0,
      top: "50%",
      width: "100%",
      borderTop: "1px solid #e2e8f0",
      zIndex: 0,
    },
    errorMessage: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "12px 16px",
      color: "#dc2626",
      fontSize: "0.9rem",
      textAlign: "center",
      marginBottom: "16px",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid #ffffff40",
      borderTop: "2px solid #ffffff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "8px",
    },
  };

  // Hover & focus handlers
  const handleHover = (e, isHovering) => {
    Object.assign(
      e.target.style,
      isHovering ? styles.submitButtonHover : styles.submitButton
    );
  };

  const handleFocus = (e, isFocused) => {
    Object.assign(e.target.style, isFocused ? styles.inputFocus : styles.input);
  };

  return (
    <>
      <styles>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </styles>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <img src={logo1} alt="Logo" style={styles.logo} />
            </div>
            <h1 style={styles.title}>Iniciar Sesión</h1>
            <p style={styles.subtitle}>Accede con tu matrícula y contraseña</p>
          </div>
          {/* Mensaje de Error */}
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Matrícula */}
            <div>
              <label htmlFor="matricula" style={styles.label}>
                Matrícula
              </label>
              <input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ej: AB12345"
                required
                style={styles.input}
                onFocus={(e) => handleFocus(e, true)}
                onBlur={(e) => handleFocus(e, false)}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" style={styles.label}>
                Contraseña
              </label>
              <div style={styles.passwordContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    ...styles.input,
                    paddingRight: "48px",
                  }}
                  onFocus={(e) => handleFocus(e, true)}
                  onBlur={(e) => handleFocus(e, false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading && <span style={styles.loadingSpinner}></span>}
              {isLoading ? 'Iniciando sesión...': 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.dividerContainer}>
            <span style={styles.dividerText}>Grupo 4</span>
            <div style={styles.dividerLine}></div>
          </div>
        </div>
      </div>
    </>
    
  );
}
