

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
        setError('Credenciales incorrectas. Verifica tu matrícula y contraseña.');
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
              <img src="/imagenes/logo1.png" alt="Logo" style={styles.logo} />
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
