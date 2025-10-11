import { useState } from "react";

export default function RegisterTreatmentPage() {
  const [form, setForm] = useState({
    patientId: "",
    startDate: "",
    description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Tratamiento registrado: " + JSON.stringify(form));
    setForm({ patientId: "", startDate: "", description: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Registrar Tratamiento</h2>
      <form className="bg-white shadow p-6 rounded-lg space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="patientId" placeholder="ID del Paciente" value={form.patientId} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" placeholder="Descripción del Tratamiento" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Registrar</button>
      </form>
    </div>
  );
}
