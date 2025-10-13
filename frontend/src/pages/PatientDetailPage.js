import { useParams } from "react-router-dom";
import { usePatients } from "../contexts/patients-context";

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const { getPatientById } = usePatients();
  const patient = getPatientById(patientId);

  const styles = {
    container: "container mx-auto px-4 py-8",
    title: "text-2xl font-bold mb-4",
    email: "mb-4 text-gray-600",
    treatmentContainer: "mb-6",
    treatmentTitle: "text-xl font-semibold mb-2",
    consultasContainer: "space-y-4",
    consultaCard: "border p-4 rounded-lg shadow-sm flex gap-4 items-center",
    consultaImage: "w-24 h-24 object-cover rounded",
    consultaText: "font-medium",
    consultaDetail: "text-gray-500",
    consultaMonto: "font-bold",
  };

  if (!patient) return <p>Paciente no encontrado.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {patient.nombre} {patient.apellido}
      </h2>
      <p className={styles.email}>Email: {patient.email}</p>

      {patient.tratamientos.map((t) => (
        <div key={t.id} className={styles.treatmentContainer}>
          <h3 className={styles.treatmentTitle}>{t.nombre}</h3>
          <div className={styles.consultasContainer}>
            {t.consultas.map((c) => (
              <div key={c.id} className={styles.consultaCard}>
                <img
                  src={c.imagen}
                  alt={c.descripcion}
                  className={styles.consultaImage}
                />
                <div>
                  <p className={styles.consultaText}>{c.fecha} - {c.lugar}</p>
                  <p>{c.descripcion}</p>
                  <p className={styles.consultaDetail}>{c.detalle}</p>
                  <p className={styles.consultaMonto}>${c.monto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
