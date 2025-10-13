
const styles = {
  container: "flex flex-col gap-2 mb-4",
  input: "p-2 rounded text-gray-900",
  button: "bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded",
}

export default function SearchBar({ value, onChange, onAdd }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      <button onClick={onAdd} className={styles.button}>
        + Nuevo paciente
      </button>
    </div>
  )
}
