import { useState } from "react";
import FormularioTratamiento from "../components/tratamiento/FormTratamiento";
import VistaPreviaTratamiento from "../components/tratamiento/VIstaPreviaTratamiento";

export default function RegistrarTratamientoPage() {
  const [formulario, setFormulario] = useState({
    pacienteId: "",
    fechaInicio: "",
    descripcion: "",
  });

  const manejarCambio = (e) =>
    setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const manejarEnvio = (e) => {
    e.preventDefault();
    alert("Tratamiento registrado: " + JSON.stringify(formulario));
    setFormulario({ pacienteId: "", fechaInicio: "", descripcion: "" });
  };

  const styles = {
    container: "container mx-auto px-4 py-8",
    headerTitle: "text-2xl font-bold text-gray-900 mb-2",
    headerSubtitle: "text-gray-600 mb-6",
    layout: "flex flex-col md:flex-row gap-8",
  };

  return (
    <div className={styles.container}>
      {/* Encabezado integrado en el page */}
      <header>
        <h2 className={styles.headerTitle}>Registrar Tratamiento</h2>
        <p className={styles.headerSubtitle}>
          Completá los datos del tratamiento para vincularlo a un paciente.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Componentes funcionales separados */}
        <FormularioTratamiento
          formulario={formulario}
          onChange={manejarCambio}
          onSubmit={manejarEnvio}
        />
        <VistaPreviaTratamiento formulario={formulario} />
      </div>
    </div>
  );
}
