export default function ConsultasList({ consultas }) {
  const styles = {
    noConsultas: "text-gray-400 mt-2",
    container: "space-y-3 mt-2",
    consultaCard: "p-3 border rounded bg-gray-700 text-gray-100",
  };

  if (!consultas?.length)
    return <p className={styles.noConsultas}>No hay consultas registradas.</p>;

  return (
    <div className={styles.container}>
      {consultas.map((c) => (
        <div key={c.id} className={styles.consultaCard}>
          <p><strong>Fecha:</strong> {c.fecha}</p>
          <p><strong>Lugar:</strong> {c.lugar}</p>
          <p><strong>Descripción:</strong> {c.descripcion}</p>
          <p>
            <strong>Monto:</strong> ${c.monto} ({c.detalle})
          </p>
        </div>
      ))}
    </div>
  );
}
