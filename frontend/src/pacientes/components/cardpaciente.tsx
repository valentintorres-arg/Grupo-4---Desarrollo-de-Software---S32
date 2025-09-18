import React from "react";
import { Calendar, Clock} from "lucide-react";

interface CardProps {
  nombre: string;
  edad: number;
  diagnostico: string;
  id: number;
  estado: string;
  inicio: string;
  duracion: string;
  progreso: number; 
  cita: string;
}

const Card: React.FC<CardProps> = ({nombre,edad,id,estado,inicio,duracion,progreso,cita}) => {
  return (
<div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 max-w-4xl w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{nombre}</h2>
          <p className="text-gray-700">Edad: {edad} años</p>
          <p className="text-gray-700">ID: #{id}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                estado === "Activo" ? "bg-pink-400 text-white" : "bg-gray-300 text-gray-700"}`}>Tratamiento {estado}</span>
        </div>

        <div className="text-gray-700 text-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span><Calendar/></span>
            <span>Inicio: {inicio}</span>
          </div>
          <div className="flex items-center gap-3">
            <span><Clock/></span>
            <span>Duración estimada: {duracion}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="text-gray-700 text-sm font-medium">Progreso del Tratamiento</p>
          <div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-teal-400 h-3"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-xs">{progreso}% completado</p>
        </div>

        <div className="text-gray-700 text-sm flex flex-col items-start">
          <p className="font-medium">Próxima Cita</p>
          <span>{cita}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
