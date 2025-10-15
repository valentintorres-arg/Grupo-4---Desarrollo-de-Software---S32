import { useState } from "react"

export default function PersonalInfo({ patientData, onFieldUpdate }) {
  const [campoEditando, setCampoEditando] = useState(null)
  const [valorEditado, setValorEditado] = useState("")

  const handleEdit = (campo, valorActual) => {
    setCampoEditando(campo)
    setValorEditado(valorActual)
  }

  const handleSave = (campo) => {
    onFieldUpdate(campo, valorEditado)
    setCampoEditando(null)
    setValorEditado("")
  }

  const handleCancel = () => {
    setCampoEditando(null)
    setValorEditado("")
  }

  const campos = [
    { key: "nombre", label: "Nombre", editable: true },
    { key: "apellido", label: "Apellido", editable: true },
    { key: "telefono", label: "Número de Teléfono", editable: true },
    { key: "email", label: "Email", editable: true },
    { key: "obraSocial", label: "Obra Social Preferida", editable: true },
    { key: "genero", label: "Género", editable: true, type: "select" },
    { key: "fechaNacimiento", label: "Fecha de Nacimiento", editable: true, type: "date" },
    { key: "dni", label: "DNI", editable: true },
  ]

  return (
    <div className="cuadro-info-personal">
      {campos.map((campo) => (
        <div key={campo.key} className="campo-info">
          <label className="etiqueta-campo">{campo.label}</label>
          <div className="contenido-campo">
            {campoEditando === campo.key ? (
              <div className="modo-edicion">
                {campo.type === "select" ? (
                  <select
                    value={valorEditado}
                    onChange={(e) => setValorEditado(e.target.value)}
                    className="entrada-campo"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                ) : (
                  <input
                    type={campo.type === "date" ? "date" : "text"}
                    value={valorEditado}
                    onChange={(e) => setValorEditado(e.target.value)}
                    className="entrada-campo"
                  />
                )}
                <div className="acciones-edicion">
                  <button onClick={() => handleSave(campo.key)} className="btn-guardar">
                    Guardar
                  </button>
                  <button onClick={handleCancel} className="btn-cancelar">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="modo-vista">
                <span className={`valor-campo ${!campo.editable ? "no-editable" : ""}`}>
                  {patientData[campo.key]}
                </span>
                {campo.editable && (
                  <button
                    onClick={() => handleEdit(campo.key, patientData[campo.key])}
                    className="btn-editar"
                    aria-label={`Editar ${campo.label}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
