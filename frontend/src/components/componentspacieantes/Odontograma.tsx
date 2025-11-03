import React, { useState, useEffect } from "react";
import "./Odontograma.css";

interface ZonaDiente {
  arriba?: string;
  abajo?: string;
  izquierda?: string;
  derecha?: string;
  centro?: string;
}

const diagnosticos = [
  { nombre: "Sano", color: "#ffffff" },
  { nombre: "Caries", color: "#e53935" },
  { nombre: "Sellante", color: "#2e7d32" },
  { nombre: "Amalgama", color: "#9e9e9e" },
  { nombre: "Composite", color: "#1e88e5" },
  { nombre: "Extracción Indicada", color: "#000000" },
  { nombre: "Pieza Ausente", color: "#616161" },
];

export default function Odontograma() {
  const dientesIds = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ];

  const [paciente, setPaciente] = useState("Juan Pérez");
  const [seleccionado, setSeleccionado] = useState("Sano");
  const [odontogramaJSON, setOdontogramaJSON] = useState("");

  const [dientes, setDientes] = useState<Record<number, ZonaDiente>>(() => {
    const obj: Record<number, ZonaDiente> = {};
    dientesIds.flat().forEach((id) => {
      obj[id] = {
        arriba: "Sano",
        abajo: "Sano",
        izquierda: "Sano",
        derecha: "Sano",
        centro: "Sano",
      };
    });
    return obj;
  });

  // ACTUALIZACION DEL JSON
  useEffect(() => {
    const jsonCompleto = {
      paciente,
      odontograma: dientes,
    };
    setOdontogramaJSON(JSON.stringify(jsonCompleto, null, 2));
  }, [paciente, dientes]);

  const cambiarZona = (id: number, zona: keyof ZonaDiente) => {
    setDientes((prev) => {
      const copia = { ...prev };
      const diente = { ...copia[id] };
      diente[zona] = diente[zona] === seleccionado ? "Sano" : seleccionado;
      copia[id] = diente;
      return copia;
    });
  };

  const colorZona = (id: number, zona: keyof ZonaDiente) => {
    const nombre = dientes[id]?.[zona];
    return diagnosticos.find((d) => d.nombre === nombre)?.color || "#fff";
  };

  return (
    <div className="odontograma">
      <aside className="panel">

        <h3>Seleccione diagnóstico</h3>
        {diagnosticos.map((d) => (
          <label
            key={d.nombre}
            className={`opcion ${seleccionado === d.nombre ? "activo" : ""}`}
          >
            <input
              type="radio"
              name="diag"
              checked={seleccionado === d.nombre}
              onChange={() => setSeleccionado(d.nombre)}
            />
            <span
              className="color"
              style={{ backgroundColor: d.color }}
            ></span>
            {d.nombre}
          </label>
        ))}
      </aside>

      <main className="mapa">
        {dientesIds.map((fila, i) => (
          <div key={i} className="fila">
            {fila.map((id) => (
              <div key={id} className="diente">
                <div
                  className="sector arriba"
                  style={{ backgroundColor: colorZona(id, "arriba") }}
                  onClick={() => cambiarZona(id, "arriba")}
                ></div>
                <div
                  className="sector abajo"
                  style={{ backgroundColor: colorZona(id, "abajo") }}
                  onClick={() => cambiarZona(id, "abajo")}
                ></div>
                <div
                  className="sector izquierda"
                  style={{ backgroundColor: colorZona(id, "izquierda") }}
                  onClick={() => cambiarZona(id, "izquierda")}
                ></div>
                <div
                  className="sector derecha"
                  style={{ backgroundColor: colorZona(id, "derecha") }}
                  onClick={() => cambiarZona(id, "derecha")}
                ></div>
                <div
                  className="sector centro"
                  style={{ backgroundColor: colorZona(id, "centro") }}
                  onClick={() => cambiarZona(id, "centro")}
                >
                  {id}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
{/*
      <section className="json-viewer">
        <h3>JSON PARA VER LA ACTUALIZACION</h3>
        <pre>{odontogramaJSON}</pre>
      </section>
*/}
    </div>
  );
}
