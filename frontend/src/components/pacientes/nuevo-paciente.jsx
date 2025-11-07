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
    setForm((prev) => ({...prev, [name]: value }));
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
        throw new Error("La fecha de nacimiento debe ser anterior a hoy")
      }

      const patientData = {
        dni: parseInt(form.dni),
        nombre: form.nombre?.trim() || '',
        apellido: form.apellido?.trim() || '',
        fecha_nacimiento: form.fecha_nacimiento,
        genero: form.genero,
        email: form.email?.trim() || '',
        telefono: form.telefono?.trim() || '',
        direccion: form.direccion?.trim() || '',
        numeroOS: form.numeroOS?.trim() || '',
        obraSocial: parseInt(form.obraSocial),
        contacto_emergencia_nombre: form.contacto_emergencia_nombre?.trim() || '',
        contacto_emergencia_relacion: form.contacto_emergencia_relacion?.trim() || '',
        contacto_emergencia_telefono: form.contacto_emergencia_telefono?.trim() || '',
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

  const styles = {
    container: "min-h-screen bg-gray-100 p-6",
    innerContainer: "max-w-5xl mx-auto",
    title: "text-3xl font-bold mb-6 text-gray-800",
    form: "bg-white p-8 rounded-lg shadow-md",
    section: "space-y-4 mb-8",
    sectionTitle: "text-xl font-semibold text-gray-700 mb-4",
    input: "w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
    textarea: "w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[100px]",
    select: "w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
    submitButtonContainer: "flex justify-end gap-4 mt-8",
    submitButton: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-white px-8 py-3 rounded-lg font-semibold",
    cancelButton: "bg-gray-500 hover:bg-gray-600 transition text-white px-8 py-3 rounded-lg font-semibold",
    error: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6",
    loading: "text-gray-600 text-center py-4",
    grid: "grid gap-6 md:grid-cols-2",
    gridFull: "md:col-span-2",
    ageDisplay: "text-sm text-gray-600 mt-1",
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h2 className={styles.title}>Registrar Nuevo Paciente</h2>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Información Personal */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
            <div className={styles.grid}>
              <input
                type="text"
                name="dni"
                placeholder="DNI (sin puntos ni espacios)"
                value={form.dni}
                onChange={handleChange}
                className={styles.input}
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
                  className={styles.input}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                {form.fecha_nacimiento && (
                  <div className={styles.ageDisplay}>
                    Edad: {calcularEdad(form.fecha_nacimiento)} años
                  </div>
                )}
              </div>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className={styles.select}
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
                className={styles.input}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono (ej: +54 11 1234-5678)"
                value={form.telefono}
                onChange={handleChange}
                className={styles.input}
              />
              <div className={styles.gridFull}>
                <textarea
                  name="direccion"
                  placeholder="Dirección completa"
                  value={form.direccion}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* Información de Obra Social */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Obra Social</h3>
            <div className={styles.grid}>
              <select
                name="obraSocial"
                value={form.obraSocial}
                onChange={handleChange}
                className={styles.select}
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
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contacto de Emergencia</h3>
            <div className={styles.grid}>
              <input
                type="text"
                name="contacto_emergencia_nombre"
                placeholder="Nombre completo"
                value={form.contacto_emergencia_nombre}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="contacto_emergencia_relacion"
                placeholder="Relación (ej: Madre, Padre, Cónyuge)"
                value={form.contacto_emergencia_relacion}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="tel"
                name="contacto_emergencia_telefono"
                placeholder="Teléfono de emergencia"
                value={form.contacto_emergencia_telefono}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className={styles.submitButtonContainer}>
            <button 
              type="button" 
              onClick={() => navigate("/patients")}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
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
