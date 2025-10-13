import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo1 from '../components/icons/logo1.png';

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[v2] Login attempt:", { matricula, password });
  };

  const styles = {
    container: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-6",
    card: "bg-white rounded-2xl shadow-lg p-12 max-w-md w-full",
    header: "text-center mb-10",
    logoContainer: "inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6",
    logo: "w-full h-full",
    title: "text-3xl font-bold text-gray-900 mb-2",
    subtitle: "text-gray-500 text-sm",
    form: "space-y-6",
    label: "block text-sm font-semibold text-gray-700 mb-2",
    input: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    passwordContainer: "relative",
    toggleButton: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700",
    submitButton: "w-full py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold text-lg hover:shadow-lg transition-all duration-200",
    dividerContainer: "relative text-center mt-10",
    dividerText: "bg-white px-4 text-gray-400 text-sm",
    dividerLine: "absolute left-0 top-1/2 w-full border-t border-gray-200 -z-10",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src={logo1} alt="Logo" className={styles.logo} />
          </div>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>Accede con tu matrícula y contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Matrícula */}
          <div>
            <label htmlFor="matricula" className={styles.label}>Matrícula</label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ej: AB12345"
              required
              className={styles.input}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input + " pr-12"} // mantiene espacio para el botón
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleButton}
                aria-label="Mostrar/ocultar contraseña"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={styles.submitButton}>
            Iniciar Sesión
          </button>
        </form>

        {/* Divider */}
        <div className={styles.dividerContainer}>
          <span className={styles.dividerText}>Grupo 4</span>
          <div className={styles.dividerLine}></div>
        </div>
      </div>
    </div>
  );
}
