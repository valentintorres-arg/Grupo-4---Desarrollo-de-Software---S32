import React from "react";
import { CheckCircle, Clock, Circle } from "lucide-react";

export interface Seguimiento {
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: "Completado" | "Próximo" | "Pendiente";
}

interface TimelineProps {
  eventos: Seguimiento[];
}

const estadoColor = {
  Completado: "bg-teal-500 text-white",
  Próximo: "bg-purple-500 text-white",
  Pendiente: "bg-gray-300 text-gray-700",
};

const CardProgreso: React.FC<TimelineProps> = ({ eventos }) => {
  return (
    <div className="relative border-l border-gray-200 bg-white border">
      {eventos.map((evento, idx) => (
        <div key={idx} className="mb-8 ml-6 relative">
          <span
            className={`absolute -left-6 flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white ${
              evento.estado === "Completado"
                ? "bg-teal-500"
                : evento.estado === "Próximo"
                ? "bg-purple-500"
                : "bg-gray-300"
            }`}
          >
            {evento.estado === "Completado" ? (
              <CheckCircle size={16} className="text-white" />
            ) : evento.estado === "Próximo" ? (
              <Clock size={16} className="text-white" />
            ) : (
              <Circle size={16} className="text-white" />
            )}
          </span>

          <h3 className="flex items-center text-lg font-semibold">
            {evento.titulo}
            <span
              className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${estadoColor[evento.estado]}`}
            >
              {evento.estado}
            </span>
          </h3>

          <p className="text-gray-600">{evento.descripcion}</p>
          <span className="text-sm text-gray-400">{evento.fecha}</span>
        </div>
      ))}
    </div>
  );
};

export default CardProgreso;
