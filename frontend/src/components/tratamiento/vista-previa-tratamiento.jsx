export default function VistaPreviaTratamiento({ formulario }) {
  const styles = {
    container: "bg-gray-100 p-6 rounded-lg shadow w-full md:w-1/3",
    title: "text-xl font-semibold mb-2",
    list: "text-gray-700 space-y-2",
    empty: "text-gray-500",
  };

  const { pacienteId, fechaInicio, descripcion } = formulario;

  return (
    <aside className={styles.container}>
      <h3 className={styles.title}>Vista previa</h3>

      {!pacienteId && !fechaInicio && !descripcion ? (
        <p className={styles.empty}>
          Completá el formulario para ver un resumen.
        </p>
      ) : (
        <ul className={styles.list}>
          <li><strong>ID Paciente:</strong> {pacienteId}</li>
          <li><strong>Fecha de inicio:</strong> {fechaInicio}</li>
          <li><strong>Descripción:</strong> {descripcion}</li>
        </ul>
      )}
    </aside>
  );
}
