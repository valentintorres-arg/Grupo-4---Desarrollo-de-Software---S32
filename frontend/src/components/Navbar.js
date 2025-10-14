import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const styles = {
    nav: "bg-blue-600 text-white p-4 flex justify-between items-center shadow",
    title: "text-2xl font-bold",
    buttonContainer: "flex gap-4",
    button: "px-3 py-2 rounded hover:bg-blue-700 transition",
  };

  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>OdontoSys 🦷</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => navigate("/")}>
          Home
        </button>
        <button className={styles.button} onClick={() => navigate("/patients")}>
          Pacientes
        </button>
        <button className={styles.button} onClick={() => navigate("/patients/new")}>
          Nuevo Paciente
        </button>
        <button className={styles.button} onClick={() => navigate("/register")}>
          Registrar Tratamiento
        </button>
      </div>
    </nav>
  );
}
