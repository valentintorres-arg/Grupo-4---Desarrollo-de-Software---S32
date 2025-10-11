import { useParams } from "react-router-dom";
import { usePatients } from "../contexts/patients-context";

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const { getPatientById } = usePatients();
  const patient = getPatientById(patientId);

  if (!patient) return <p>Paciente no encontrado.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">
        {patient.nombre} {patient.apellido}
      </h2>
      <p className="mb-4 text-gray-600">Email: {patient.email}</p>

      {patient.tratamientos.map((t) => (
        <div key={t.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{t.nombre}</h3>
          <div className="space-y-4">
            {t.consultas.map((c) => (
              <div
                key={c.id}
                className="border p-4 rounded-lg shadow-sm flex gap-4 items-center"
              >
                <img
                  src={c.imagen}
                  alt={c.descripcion}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{c.fecha} - {c.lugar}</p>
                  <p>{c.descripcion}</p>
                  <p className="text-gray-500">{c.detalle}</p>
                  <p className="font-bold">${c.monto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
