export default function FormTratamiento({ formulario, onChange, onSubmit }) {
  const styles = {
    form: "bg-white shadow p-6 rounded-lg space-y-4 w-full md:w-2/3",
    input: "w-full border px-3 py-2 rounded",
    textarea: "w-full border px-3 py-2 rounded",
    button: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition",
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        type="text"
        name="pacienteId"
        placeholder="DNI del Paciente"
        value={formulario.pacienteId}
        onChange={onChange}
        className={styles.input}
        required
      />

      <input
        type="date"
        name="fechaInicio"
        value={formulario.fechaInicio}
        onChange={onChange}
        className={styles.input}
        required
      />

      <textarea
        name="descripcion"
        placeholder="Descripción del Tratamiento"
        value={formulario.descripcion}
        onChange={onChange}
        className={styles.textarea}
        required
      />

      <button type="submit" className={styles.button}>
        Registrar
      </button>
    </form>
  );
}
