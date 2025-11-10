import React, { useEffect, useState } from "react";

/**
 * ModalAgregarAntecedente.jsx
 *
 * Props:
 * - isOpen: boolean (show/hide modal)
 * - onClose: function() (called when modal is closed)
 * - onAdd: function({ fecha, descripcion }) (called with new antecedent)
 *
 * Usage:
 * <ModalAgregarAntecedente isOpen={open} onClose={() => setOpen(false)} onAdd={(item)=>console.log(item)} />
 */

export default function ModalAgregarAntecedente({ isOpen, onClose, onAdd, initialData, isEditing }) {
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Modo edición: cargar datos existentes
                setFecha(initialData.fecha || "");
                setDescripcion(initialData.descripcion || "");
            } else {
                // Modo creación: limpiar campos
                setFecha("");
                setDescripcion("");
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const validate = () => {
        const e = {};
        if (!fecha) {
            e.fecha = "La fecha es obligatoria.";
        } else {
            // Validar que la fecha no sea futura
            const fechaSeleccionada = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999); // Permitir hasta el final del día de hoy
            
            if (fechaSeleccionada > hoy) {
                e.fecha = "No se pueden agregar antecedentes con fechas futuras.";
            }
        }
        if (!descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
        return e;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length === 0) {
            const newAntecedente = { fecha, descripcion: descripcion.trim() };
            if (typeof onAdd === "function") onAdd(newAntecedente);
            if (typeof onClose === "function") onClose();
        }
    };

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    const modalStyle = {
        background: "#fff",
        borderRadius: 8,
        width: 480,
        maxWidth: "90%",
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    };

    const inputStyle = {
        width: "100%",
        padding: "8px 10px",
        borderRadius: 4,
        border: "1px solid #ccc",
        marginTop: 6,
    };

    const labelStyle = { marginTop: 12, display: "block", fontSize: 14 };

    const errorStyle = { color: "#b00020", fontSize: 12, marginTop: 6 };

    return (
        <div style={overlayStyle} role="dialog" aria-modal="true" aria-label={isEditing ? "Modificar antecedente" : "Agregar antecedente"}>
            <div style={modalStyle}>
                <h3 style={{ margin: 0 }}>{isEditing ? "Modificar antecedente" : "Agregar antecedente"}</h3>

                <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
                    <label style={labelStyle}>
                        Fecha
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            style={inputStyle}
                            aria-invalid={!!errors.fecha}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </label>
                    {errors.fecha && <div style={errorStyle}>{errors.fecha}</div>}

                    <label style={labelStyle}>
                        Descripción
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            style={{ ...inputStyle, resize: "vertical" }}
                            aria-invalid={!!errors.descripcion}
                        />
                    </label>
                    {errors.descripcion && <div style={errorStyle}>{errors.descripcion}</div>}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                        <button
                            type="button"
                            onClick={() => typeof onClose === "function" && onClose()}
                            style={{ padding: "8px 12px", background: "#eee", borderRadius: 4, border: "none" }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 12px",
                                background: "#007bff",
                                color: "#fff",
                                borderRadius: 4,
                                border: "none",
                            }}
                        >
                            {isEditing ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}