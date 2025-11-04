import React from "react";




// helper to fetch consultas (adjust URL as needed) and a presentational card
export async function listarConsultas() {
    try {
        const res = await fetch('/api/consultas'); // <-- change to your API endpoint
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
    } catch (err) {
        console.error(err);
        // fallback/demo data
        return [
            { id: 1, fecha: '2025-10-01', motivo: 'Dolor de cabeza', doctor: 'Dr. Pérez', notas: 'Recetado paracetamol' },
            { id: 2, fecha: '2025-09-15', motivo: 'Chequeo general', doctor: 'Dra. López', notas: 'Sin observaciones' }
        ];
    }
}

export function CardConsulta({ consulta }) {
    return (
        <div className="card-consulta" style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{consulta.motivo}</div>
            <div>Fecha: {consulta.fecha}</div>
            <div>Doctor: {consulta.doctor}</div>
            <div>Notas: {consulta.notas}</div>
        </div>
    );
}


export function ListadoConsultas() {
    const [consultas, setConsultas] = React.useState([]);
    const [cargando, setCargando] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await listarConsultas();
                if (mounted) setConsultas(Array.isArray(data) ? data : []);
            } catch (e) {
                if (mounted) setConsultas([]);
            } finally {
                if (mounted) setCargando(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (cargando) return <div>Cargando consultas...</div>;
    if (!consultas.length) return <div>No hay consultas</div>;

    return (
        <div>
            {consultas.map((consulta) => (
                <CardConsulta
                    key={consulta.id ?? `${consulta.fecha}-${consulta.motivo}`}
                    consulta={consulta}
                />
            ))}
        </div>
    );
}
export default function Consultas() {
    return (
        <section>
            <div>
                <p>Historial de consultas del paciente</p>
                <div>
                    <CardConsulta />
                </div>
            
            
            
            </div>





        </section>

    );



}