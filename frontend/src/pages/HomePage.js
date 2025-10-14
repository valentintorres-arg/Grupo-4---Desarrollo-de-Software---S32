import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const styles = {
    container: "flex flex-col items-center mt-20 text-gray-700",
    titulo: "text-3xl font-bold",
    subtitulo: "mt-4 mb-8",
    boton: "px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200",
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Bienvenido a OdontoSys</h2>
      <p className={styles.subtitulo}>Seleccione una opción del menú</p>

      <button
        onClick={() => navigate("/login")}
        className={styles.boton}
      >
        Iniciar Sesión
      </button>
    </div>
  );
}
