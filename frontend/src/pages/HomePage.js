import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-20 text-gray-700">
      <h2 className="text-3xl font-bold">Bienvenido a OdontoSys</h2>
      <p className="mt-4 mb-8">Seleccione una opción del menú</p>

      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
      >
        Iniciar Sesión
      </button>
    </div>
  );
}
