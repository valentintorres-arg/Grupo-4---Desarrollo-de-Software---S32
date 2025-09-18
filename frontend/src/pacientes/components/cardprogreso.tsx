import React from "react"
import { CheckCircle, Clock, Circle } from "lucide-react"

export interface Seguimiento {
  titulo: string
  descripcion: string
  fecha: string
  estado: "Completado" | "Próximo" | "Pendiente"
}

interface TimelineProps {
  eventos: Seguimiento[]
}

const CardProgreso: React.FC<TimelineProps> = ({ eventos }) => {
  const badgeBase =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors"

    //armo el case para validar el estado y cambio el estilado 
  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case "Completado":
        return "bg-teal-500 text-white"
      case "Próximo":
        return "bg-purple-500 text-white"
      case "Pendiente":
        return "bg-gray-300 text-gray-700"
      default:
        return "bg-gray-300 text-gray-700"
    }
  }

  const getIcon = (estado: string) => {
    switch (estado) {
      case "Completado":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "Próximo":
        return <Clock className="h-5 w-5 text-white" />
      case "Pendiente":
        return <Circle className="h-5 w-5 text-white" />
      default:
        return <Circle className="h-5 w-5 text-white" />
    }
  }

  return (
    <div className="relative border-l border-gray-300 bg-gray-50 rounded-lg p-6 shadow-lg">
      {eventos.map((evento, idx) => (
        <div key={idx} className="mb-8 ml-6 relative">
          <span
            className={`absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${getBadgeStyle(
              evento.estado
            )}`}
          >
            {getIcon(evento.estado)}
          </span>

          {idx < eventos.length - 1 && (
            <span className="absolute -left-5 top-6 w-px h-full bg-gray-300" />
          )}

          <div className="pl-8">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{evento.titulo}</h3>
              <span className={`${badgeBase} ${getBadgeStyle(evento.estado)}`}>
                {evento.estado}
              </span>
            </div>

            <p className="text-sm text-gray-600">{evento.descripcion}</p>
            {evento.fecha && <p className="text-xs text-gray-400">{evento.fecha}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardProgreso
