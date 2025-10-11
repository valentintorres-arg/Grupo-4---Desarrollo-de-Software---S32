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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6">
            <img src={logo1} alt="Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-500 text-sm">Accede con tu matrícula y contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Matrícula */}
          <div>
            <label htmlFor="matricula" className="block text-sm font-semibold text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Ej: AB12345"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                aria-label="Mostrar/ocultar contraseña"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold text-lg hover:shadow-lg transition-all duration-200"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center mt-10">
          <span className="bg-white px-4 text-gray-400 text-sm">Grupo 4</span>
          <div className="absolute left-0 top-1/2 w-full border-t border-gray-200 -z-10"></div>
        </div>
      </div>
    </div>
  );
}
