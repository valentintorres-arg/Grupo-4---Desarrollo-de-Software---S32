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
   

  
   
  };

  return (

    
      <div className={styles.layout}>
        <FormularioTratamiento
          formulario={formulario}
          onChange={manejarCambio}
          onSubmit={manejarEnvio}
        />
        <VistaPreviaTratamiento formulario={formulario} />
      </div>
   
  );
}