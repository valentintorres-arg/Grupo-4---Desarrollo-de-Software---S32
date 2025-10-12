export default function ProfileHeader({ nombre, apellido, edad, genero }) {
  const getGenderIcon = () => {
    if (genero === "Masculino") {
      return (
        <svg
          className="icono-genero masculino"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M12 8l-3 3" />
          <path d="M12 8l3 3" />
        </svg>
      )
    } else {
      return (
        <svg
          className="icono-genero femenino"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M12 14v6M9 17h6" />
        </svg>
      )
    }
  }

  return (
    <div className="encabezado-perfil">
      <div className="imagen-portada"></div>
      <div className="info-perfil">
        <div className="avatar-perfil">{getGenderIcon()}</div>
        <div className="detalles-perfil">
          <h1 className="nombre-perfil">
            {nombre} {apellido}
          </h1>
          <p className="edad-perfil">{edad} años</p>
        </div>
      </div>
    </div>
  )
}
