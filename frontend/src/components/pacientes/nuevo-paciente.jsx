import { useState } from "react";
import { usePatients } from "../../hooks/usePatients";
import { useNavigate } from "react-router-dom";
import { calcularEdad, validarFechaNacimiento } from "../../utils/dateUtils";

export default function NuevoPacientePage() {
  const { createPatient, obrasSociales, loading, error, setError } = usePatients();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    email: "",
    telefono: "",
    direccion: "",
    numeroOS: "",
    obraSocial: "",
    contacto_emergencia_nombre: "",
    contacto_emergencia_relacion: "",
    contacto_emergencia_telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!form.obraSocial) {
        throw new Error("Debe seleccionar una obra social");
      }

      if (!form.genero) {
        throw new Error("Debe seleccionar un género");
      }

      if (!validarFechaNacimiento(form.fecha_nacimiento)) {
        throw new Error("La fecha de nacimiento debe ser anterior a hoy");
      }

      const patientData = {
        dni: parseInt(form.dni),
        nombre: form.nombre?.trim() || "",
        apellido: form.apellido?.trim() || "",
        fecha_nacimiento: form.fecha_nacimiento,
        genero: form.genero,
        email: form.email?.trim() || "",
        telefono: form.telefono?.trim() || "",
        direccion: form.direccion?.trim() || "",
        numeroOS: form.numeroOS?.trim() || "",
        obraSocial: parseInt(form.obraSocial),
        contacto_emergencia_nombre: form.contacto_emergencia_nombre?.trim() || "",
        contacto_emergencia_relacion: form.contacto_emergencia_relacion?.trim() || "",
        contacto_emergencia_telefono: form.contacto_emergencia_telefono?.trim() || "",
      };

      await createPatient(patientData);
      navigate("/patients");
    } catch (err) {
      console.error("Error al crear paciente:", err);
      setError(err.message || "Error al crear el paciente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nuevo-container">
      <style>
        {`
          .nuevo-container {
            min-height: 100vh;
            background-color: #f3f4f6;
            padding: 1.5rem;
            margin-top: 5rem;
          }

          .nuevo-inner-container {
            max-width: 80rem;
            margin: 0 auto;
          }

          .nuevo-title {
            text-align: center; /* centrado del título */
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #1f2937;
          }

          .nuevo-form {
            background-color: #fff;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .nuevo-section {
            margin-bottom: 2rem;
          }

          .nuevo-section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 1rem;
          }

          .nuevo-input,
          .nuevo-select,
          .nuevo-textarea {
            width: 100%;
            border: 1px solid #d1d5db;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .nuevo-input:focus,
          .nuevo-select:focus,
          .nuevo-textarea:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
          }

          .nuevo-textarea {
            min-height: 100px;
          }

          .nuevo-grid {
            display: grid;
            gap: 1.5rem;
          }

          @media (min-width: 768px) {
            .nuevo-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .nuevo-grid-full {
            grid-column: span 2;
          }

          .nuevo-age-display {
            font-size: 0.875rem;
            color: #4b5563;
            margin-top: 0.25rem;
          }

          .nuevo-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .nuevo-submit-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
          }

          .nuevo-submit {
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: background-color 0.2s;
          }

          .nuevo-submit:hover {
            background-color: #1e40af;
          }

          .nuevo-cancel {
            background-color: #6b7280;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: background-color 0.2s;
          }

          .nuevo-cancel:hover {
            background-color: #4b5563;
          }

          .nuevo-submit:disabled,
          .nuevo-cancel:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="nuevo-inner-container">
        <h2 className="nuevo-title">Registrar Nuevo Paciente</h2>

        {error && <div className="nuevo-error">{error}</div>}

        <form onSubmit={handleSubmit} className="nuevo-form">
          {/* Información Personal */}
          <div className="nuevo-section">
            <h3 className="nuevo-section-title">Información Personal</h3>
            <div className="nuevo-grid">
              <input
                type="text"
                name="dni"
                placeholder="DNI (sin puntos ni espacios)"
                value={form.dni}
                onChange={handleChange}
                className="nuevo-input"
                required
                pattern="[0-9]{7,8}"
                title="Ingrese un DNI válido de 7 u 8 dígitos"
              />
              <div>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  className="nuevo-input"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
                {form.fecha_nacimiento && (
                  <div className="nuevo-age-display">
                    Edad: {calcularEdad(form.fecha_nacimiento)} años
                  </div>
                )}
              </div>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="nuevo-select"
                required
              >
                <option value="">Seleccionar Género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
                <option value="N">Prefiero no decir</option>
              </select>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="nuevo-input"
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className="nuevo-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="nuevo-input"
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono (ej: +54 11 1234-5678)"
                value={form.telefono}
                onChange={handleChange}
                className="nuevo-input"
              />
              <div className="nuevo-grid-full">
                <textarea
                  name="direccion"
                  placeholder="Dirección completa"
                  value={form.direccion}
                  onChange={handleChange}
                  className="nuevo-textarea"
                />
              </div>
            </div>
          </div>

          {/* Obra Social */}
          <div className="nuevo-section">
            <h3 className="nuevo-section-title">Obra Social</h3>
            <div className="nuevo-grid">
              <select
                name="obraSocial"
                value={form.obraSocial}
                onChange={handleChange}
                className="nuevo-select"
                required
              >
                <option value="">Seleccionar Obra Social</option>
                {obrasSociales.map((os) => (
                  <option key={os.id} value={os.id}>
                    {os.nombre} (Cobertura: {os.cobertura}%)
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="numeroOS"
                placeholder="Número de Socio"
                value={form.numeroOS}
                onChange={handleChange}
                className="nuevo-input"
                required
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="nuevo-section">
            <h3 className="nuevo-section-title">Contacto de Emergencia</h3>
            <div className="nuevo-grid">
              <input
                type="text"
                name="contacto_emergencia_nombre"
                placeholder="Nombre completo"
                value={form.contacto_emergencia_nombre}
                onChange={handleChange}
                className="nuevo-input"
              />
              <input
                type="text"
                name="contacto_emergencia_relacion"
                placeholder="Relación (ej: Madre, Padre, Cónyuge)"
                value={form.contacto_emergencia_relacion}
                onChange={handleChange}
                className="nuevo-input"
              />
              <input
                type="tel"
                name="contacto_emergencia_telefono"
                placeholder="Teléfono de emergencia"
                value={form.contacto_emergencia_telefono}
                onChange={handleChange}
                className="nuevo-input"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="nuevo-submit-buttons">
            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="nuevo-cancel"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="nuevo-submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Guardando..." : "Agregar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
