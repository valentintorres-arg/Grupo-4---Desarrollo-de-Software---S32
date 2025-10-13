export default function ListaPacientes({ patients, onSelect, selectedId }) {
  const styles = {
    noPatients: "text-gray-400",
    list: "space-y-2 overflow-y-auto",
    item: "cursor-pointer p-2 rounded hover:bg-blue-600",
    itemSelected: "bg-blue-700 border-l-4 border-blue-400",
  };

  if (!patients.length)
    return <p className={styles.noPatients}>No hay pacientes cargados.</p>;

  return (
    <ul className={styles.list}>
      {patients.map((p) => (
        <li
          key={p.id}
          onClick={() => onSelect(p)}
          className={`${styles.item} ${
            selectedId === p.id ? styles.itemSelected : ""
          }`}
        >
          {p.nombre} {p.apellido}
        </li>
      ))}
    </ul>
  );
}
