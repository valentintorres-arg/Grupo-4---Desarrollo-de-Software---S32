import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold">OdontoSys 🦷</h1>
      <div className="flex gap-4">
        <button
          className="px-3 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="px-3 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/patients")}
        >
          Pacientes
        </button>
        <button
          className="px-3 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/patients/new")}
        >
          Nuevo Paciente
        </button>
        <button
          className="px-3 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/register")}
        >
          Registrar Tratamiento
        </button>
        
      </div>
    </nav>
  );
}
