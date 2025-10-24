import { useState } from "react";
import { usePatients } from "../contexts/patients-context";
import { useNavigate } from "react-router-dom";
import { PatientsProvider } from "../contexts/patients-context";

export default function NuevoPacientePage() {
  const { addPatient } = usePatients();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    obraSocial: "",
    obraSocialOtra: "",
  });

  const [obraSocialEsOtra, setObraSocialEsOtra] = useState(false);

  const obrasSociales = ["OSDE", "IOMA", "Swiss Medical", "Galeno", "Medife", "Otra"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "obraSocial") {
      setObraSocialEsOtra(value === "Otra");
      setForm((prev) => ({
        ...prev,
        obraSocial: value,
        obraSocialOtra: value === "Otra" ? "" : prev.obraSocialOtra,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = {
      ...form,
      obraSocial: obraSocialEsOtra ? form.obraSocialOtra : form.obraSocial,
      status: "active",
      treatmentStartDate: new Date().toISOString(),
      emergencyContact: {
        name: form.emergencyName,
        relationship: form.emergencyRelationship,
        phone: form.emergencyPhone,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicConditions: [],
        previousSurgeries: [],
        notes: "",
      },
      dentalHistory: {
        previousOrthodonticTreatment: false,
        previousOrthodonticDetails: "",
        dentalProblems: [],
        oralHabits: [],
        notes: "",
      },
    };
    addPatient(newPatient);
    navigate("/patients");
  };

  const styles = {
    container: "min-h-screen bg-gray-100 p-6",
    innerContainer: "max-w-5xl mx-auto",
    title: "text-3xl font-bold mb-6 text-gray-800",
    form: "grid gap-6 lg:grid-cols-2 bg-white p-6 rounded-lg shadow-md",
    section: "space-y-4",
    sectionTitle: "text-xl font-semibold text-gray-700",
    input: "w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
    select: "w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
    submitButtonContainer: "lg:col-span-2 flex justify-end mt-4",
    submitButton: "bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold",
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h2 className={styles.title}>Registrar Nuevo Paciente</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Información Personal */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={form.address}
              onChange={handleChange}
              className={styles.input}
            />
            <select
              name="obraSocial"
              value={form.obraSocial}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Seleccionar Obra Social</option>
              {obrasSociales.map((os) => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
            {obraSocialEsOtra && (
              <input
                type="text"
                name="obraSocialOtra"
                placeholder="Ingrese otra obra social"
                value={form.obraSocialOtra}
                onChange={handleChange}
                className={styles.input}
                required
              />
            )}
          </div>

          {/* Contacto de Emergencia */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contacto de Emergencia</h3>
            <input
              type="text"
              name="emergencyName"
              placeholder="Nombre"
              value={form.emergencyName}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="text"
              name="emergencyRelationship"
              placeholder="Relación"
              value={form.emergencyRelationship}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="text"
              name="emergencyPhone"
              placeholder="Teléfono"
              value={form.emergencyPhone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {/* Botón de Guardar */}
          <div className={styles.submitButtonContainer}>
            <button type="submit" className={styles.submitButton}>
              Agregar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
