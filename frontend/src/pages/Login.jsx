

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[v2] Login attempt:", { matricula, password });
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
  };

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src="/imagenes/logo1.png" alt="Logo" style={styles.logo} />

          </div>
          <h1 style={styles.title}>Iniciar Sesión</h1>
          <p style={styles.subtitle}>Accede con tu matrícula y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Iniciar Sesión
          </button>
        </form>

        <div style={styles.dividerContainer}>
          <span style={styles.dividerText}>Grupo 4</span>
          <div style={styles.dividerLine}></div>
        </div>
      </div>
    </div>
  );
}
