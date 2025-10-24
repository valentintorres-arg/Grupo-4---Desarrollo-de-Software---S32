import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Tratamientos() {
    const navigate = useNavigate();

    // 🧠 Estado inicial desde localStorage o genéricos
    // const [tratamientos, setTratamientos] = useState(() => {Esta linea va cuando se usa la api, no cuando es localstorage}

    const [tratamientos] = useState(() => {
        const guardados = localStorage.getItem("tratamientos");
        return guardados
        ? JSON.parse(guardados)
        : [
            {
                id: 1,
                nombre: "Ortodoncia Correctiva",
                descripcion: "Alineación dental mediante brackets metálicos tradicionales.",
                estado: "En curso",
                fechaInicio: "2025-05-10",
                fechaFin: "2025-11-10",
            },
            {
                id: 2,
                nombre: "Blanqueamiento Dental",
                descripcion: "Tratamiento estético para aclarar el tono de los dientes.",
                estado: "Finalizado",
                fechaInicio: "2025-01-05",
                fechaFin: "2025-01-20",
            },
            {
                id: 3,
                nombre: "Implante Dental",
                descripcion: "Colocación de implante de titanio en premolar inferior derecho.",
                estado: "Pendiente",
                fechaInicio: "2025-12-01",
                fechaFin: "2026-02-01",
            },
            ];
    });

    // Guardar cambios en localStorage
    useEffect(() => {
        localStorage.setItem("tratamientos", JSON.stringify(tratamientos));
    }, [tratamientos]);

    const s = {
        grid: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        },
        card: {
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        },
        estado: (estado) => ({
        alignSelf: "flex-start",
        padding: "4px 10px",
        borderRadius: 9999,
        fontSize: 13,
        fontWeight: 600,
        background:
            estado === "Finalizado"
            ? "#dcfce7"
            : estado === "Pendiente"
            ? "#fef9c3"
            : "#e0e7ff",
        color:
            estado === "Finalizado"
            ? "#166534"
            : estado === "Pendiente"
            ? "#854d0e"
            : "#3730a3",
        }),
        fecha: { fontSize: 14, color: "#6b7280" },
        addButton: {
        background: "#f8fafc",
        border: "2px dashed #cbd5e1",
        borderRadius: 12,
        padding: 24,
        textAlign: "center",
        color: "#475569",
        cursor: "pointer",
        transition: "all .2s ease",
        },
    };

    return (
        <>
        <div style={s.grid}>
            {/* 🧾 Cards de tratamientos */}
            {tratamientos.map((t) => (
            <div key={t.id} style={s.card}>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{t.nombre}</h3>
                <p style={{ fontSize: 15, color: "#374151", margin: "4px 0" }}>
                {t.descripcion}
                </p>
                <span style={s.estado(t.estado)}>{t.estado}</span>
                <p style={s.fecha}>
                🗓 Inicio: {new Date(t.fechaInicio).toLocaleDateString("es-AR")}
                </p>
                <p style={s.fecha}>
                ⏳ Fin estimado: {new Date(t.fechaFin).toLocaleDateString("es-AR")}
                </p>
            </div>
            ))}

            {/* ➕ Card para redirigir al registro */}
            <div
            style={s.addButton}
            onClick={() => navigate("/register")}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f8fafc")}
            >
            <span style={{ fontSize: 28 }}>➕</span>
            <p style={{ fontWeight: 600, marginTop: 8 }}>Agregar nuevo tratamiento</p>
            </div>
        </div>
        </>
    );
    }
