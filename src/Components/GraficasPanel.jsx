import { useState, useEffect } from "react";
import { obtenerAuthHeaders } from "../utils/auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MESES_NOMBRES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function GraficaBarras({ datos, etiquetas, color }) {
  if (!datos || datos.every(v => v === 0)) {
    return <div className="grafica-vacia">Sin datos registrados para este año</div>;
  }

  const chartData = etiquetas.map((mes, i) => ({
    mes,
    alumnos: datos[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.79)" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fill: '#ffffff', fontSize: 13, fontFamily: 'Poppins' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Poppins' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            background: '#011a3d',
            border: '1px solid #00417e',
            borderRadius: '8px',
            fontFamily: 'Poppins',
            fontSize: '13px',
            color: '#ffffff',
          }}
          cursor={{ fill: 'rgba(255,255,255,0.06)' }}
          formatter={(value) => [value, 'Alumnos']}
          labelStyle={{ color: '#ffffff', fontWeight: 900 }}
          itemStyle={{ color: '#ffffff', fontFamily: 'Poppins' }}
        />
        <Bar dataKey="alumnos" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={color} opacity={1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficasPanel() {
  const [alumnos, setAlumnos] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch("http://localhost:9002/usuarios/todosdto/3", { method: "GET", headers });
        if (res.ok) {
          const data = await res.json();
          console.log("ALUMNOS CARGADOS (primer registro):", data[0]);
          setAlumnos(data);
        }
      } catch (e) {
        console.log("Error cargando alumnos para gráfica", e);
      }
    };
    cargar();
  }, []);

  const parsearAño = (alumno) => {
    const raw = alumno.fechaRegistro || alumno.fecha_registro;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw[0];
    const fecha = new Date(raw);
    return isNaN(fecha) ? null : fecha.getFullYear();
  };

  const parsearMes = (alumno) => {
    const raw = alumno.fechaRegistro || alumno.fecha_registro;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw[1];
    const fecha = new Date(raw);
    return isNaN(fecha) ? null : fecha.getMonth() + 1;
  };

  const añosConDatos = [...new Set(
    alumnos.map(parsearAño).filter(Boolean)
  )].sort((a, b) => a - b);

  const añosDisponibles = añosConDatos.length > 0 ? añosConDatos : [new Date().getFullYear()];

  const añoFinal = añosDisponibles.includes(añoSeleccionado)
    ? añoSeleccionado
    : añosDisponibles[0];

  const conteo = {};
  alumnos.forEach(alumno => {
    const año = parsearAño(alumno);
    const mes = parsearMes(alumno);
    if (!año || !mes) return;
    if (año !== añoFinal) return;
    conteo[mes] = (conteo[mes] || 0) + 1;
  });

  const alumnosPorMes = MESES_NOMBRES.map((_, i) => conteo[i + 1] || 0);

  const idxActual = añosDisponibles.indexOf(añoFinal);
  const puedeRetroceder = idxActual > 0;
  const puedeAvanzar = idxActual < añosDisponibles.length - 1;

  return (
    <div className="graficas-panel">

      <div className="grafica-bloque">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Alumnos registrados por mes</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => puedeRetroceder && setAñoSeleccionado(añosDisponibles[idxActual - 1])}
              disabled={!puedeRetroceder}
              style={{
                background: 'none', border: 'none',
                color: puedeRetroceder ? '#ffffff' : 'rgba(255,255,255,0.25)',
                fontSize: '20px', cursor: puedeRetroceder ? 'pointer' : 'default',
                padding: '0 4px', lineHeight: 1,
              }}
            >‹</button>
            <span style={{
              color: '#ffffff', fontFamily: 'Poppins',
              fontSize: '14px', fontWeight: 600,
              minWidth: '44px', textAlign: 'center'
            }}>
              {añoFinal}
            </span>
            <button
              onClick={() => puedeAvanzar && setAñoSeleccionado(añosDisponibles[idxActual + 1])}
              disabled={!puedeAvanzar}
              style={{
                background: 'none', border: 'none',
                color: puedeAvanzar ? '#ffffff' : 'rgba(255, 255, 255, 0.69)',
                fontSize: '20px', cursor: puedeAvanzar ? 'pointer' : 'default',
                padding: '0 4px', lineHeight: 1,
              }}
            >›</button>
          </div>
        </div>
        <div className="grafica-contenido">
          <GraficaBarras
            datos={alumnosPorMes}
            etiquetas={MESES_NOMBRES}
            color="#ffffff"
          />
        </div>
      </div>

      <div className="grafica-bloque grafica-bloque--doble">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Carnets más vendidos</h3>
          <span className="grafica-subtitulo">Distribución total</span>
        </div>
        <div className="grafica-contenido grafica-contenido--donut">
          <div className="grafica-vacia">Sin datos de carnets</div>
        </div>
      </div>

      <div className="grafica-bloque grafica-bloque--full">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Evolución de carnets por mes</h3>
          <span className="grafica-subtitulo">Últimos 24 meses</span>
        </div>
        <div className="grafica-contenido">
          <div className="grafica-vacia">Sin datos de evolución de carnets</div>
        </div>
      </div>

    </div>
  );
}