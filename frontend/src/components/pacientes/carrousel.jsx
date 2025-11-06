export default function SectionCarousel({ activeSection, setActiveSection }) {
  const secciones = [
    { id: "personal", label: "Info Personal" },
    { id: "odontograma", label: "Odontograma" },
    { id: "antecedentes", label: "Antecedentes" },
    { id: "Turnos", label: "Turnos" },
  ]

  return (
    <div className="carrusel-secciones">
      {secciones.map((seccion) => (
        <button
          key={seccion.id}
          className={`pestaña-carrusel ${activeSection === seccion.id ? "activo" : ""}`}
          onClick={() => setActiveSection(seccion.id)}
        >
          {seccion.label}
        </button>
      ))}
    </div>
  )
}
