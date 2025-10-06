import logo1 from "./icons/logo1.png"
import { useState } from "react"
import "./styles/login.css"
import { FaEye, FaEyeSlash } from "react-icons/fa" 
export default function LoginForm() {
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v2] Login attempt:", { matricula, password })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src={logo1} alt="Logo" className="logo-icon" />
          </div>
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">Accede con tu matrícula y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="matricula" className="form-label">
              Matrícula
            </label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="form-input"
              placeholder="Ej: AB12345"
              required
            />
          </div>

          <div className="form-group password-wrapper">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar/ ocultar contraseña"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">Grupo 4</span>
        </div>
      </div>
    </div>
  )
}
