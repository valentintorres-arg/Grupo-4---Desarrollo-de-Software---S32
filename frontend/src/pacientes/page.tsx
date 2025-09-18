import Card from "./components/cardpaciente";
import paciente from "./data/paciente.json";
import Timeline, {Seguimiento} from "./components/cardprogreso";
import eventosData from "./data/progreso.json"
import { NotesSection } from "./components/cardnotas";
import notas from "./data/notas.json"


const eventos: Seguimiento[] = eventosData as Seguimiento[]


export default function Paciente() {
  return (
    <div className="m-10">
      <Card nombre={paciente.nombre} edad={paciente.edad} id={paciente.id} estado={paciente.estado} inicio={paciente.inicio}
        duracion={paciente.duracion} progreso={paciente.progreso} cita={paciente.cita} diagnostico={paciente.diagnostico}/>
      <div className="mt-16">
      <Timeline eventos={eventos} />
      <NotesSection title="Notas del Paciente" notes={notas} />


    </div>
  </div>
    
        
    
  );
}
