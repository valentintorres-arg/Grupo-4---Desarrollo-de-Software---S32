import ConsultasList from "./ListaConsultas";
import ConsultaCarousel from "./ConsultasCarousel";

export default function DetallePaciente({ patient }) {
  const styles = {
    container: "mt-4 space-y-6",
    name: "text-xl font-bold text-gray-100",
    email: "text-gray-400",
    treatmentCard: "border p-4 rounded bg-gray-800",
    treatmentTitle: "text-lg font-semibold mb-2",
    noPatient: "text-gray-400 mt-2",
  };

  if (!patient) return <p className={styles.noPatient}>Selecciona un paciente para ver detalles</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.name}>
        {patient.nombre} {patient.apellido}
      </h2>
      <p className={styles.email}>{patient.email}</p>

      {(patient.tratamientos || []).map((t) => (
        <div key={t.id} className={styles.treatmentCard}>
          <h3 className={styles.treatmentTitle}>{t.nombre}</h3>
          <ConsultasList consultas={t.consultas} />
          <ConsultaCarousel consultas={t.consultas} />
        </div>
      ))}
    </div>
  );
}
