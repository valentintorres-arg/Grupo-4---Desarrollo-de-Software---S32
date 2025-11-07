import { useState } from "react";
import FormularioTratamiento from "../components/tratamiento/form-tratamiento";
import VistaPreviaTratamiento from "../components/tratamiento/vista-previa-tratamiento";

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
    container: "container mx-auto px-4 pt-24 pb-8", 
    headerSubtitle: "text-gray-600 mb-6",
    layout: "flex flex-col md:flex-row gap-8",

  
    headerTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "20px",
      marginTop:"3rem",

    },
  };

  return (
    <div className={styles.container}>
      <header>
        
   
        <h2 style={styles.headerTitle}>Registrar Tratamiento</h2>
        
        <p className={styles.headerSubtitle}>
          Completá los datos del tratamiento para vincularlo a un paciente.
        </p>
      </header>

      <div className={styles.layout}>
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