import { useState, useEffect } from "react";
import { obtenerAuthHeaders } from "../utils/auth";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';

const MESES_NOMBRES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// ─── Datos ficticios realistas — los 15 carnets reales ───────────────────────

const TODOS_CARNETS = [
  { nombre: "B",     valor: 34 },
  { nombre: "A",     valor: 14 },
  { nombre: "A2",    valor: 12 },
  { nombre: "A1",    valor: 10 },
  { nombre: "AM",    valor:  8 },
  { nombre: "CAP",   valor:  6 },
  { nombre: "C",     valor:  5 },
  { nombre: "D",     valor:  4 },
  { nombre: "B1",    valor:  2 },
  { nombre: "B+E",   valor:  1 },
  { nombre: "C1",    valor:  1 },
  { nombre: "CE",    valor:  1 },
  { nombre: "C1+E",  valor:  1 },
  { nombre: "D+E",   valor:  1 },
  { nombre: "D1+E",  valor:  1 },
];

// Paleta de 9 colores (8 top + Otros)
const COLORES = [
  "#3b9eff",
  "#00d4aa",
  "#a78bfa",
  "#fb923c",
  "#f472b6",
  "#facc15",
  "#34d399",
  "#f87171",
  "#94a3b8",
];

const TOP_N = 8;
const top8 = TODOS_CARNETS.slice(0, TOP_N);
const otrosValor = TODOS_CARNETS.slice(TOP_N).reduce((s, c) => s + c.valor, 0);
const otrosNombres = TODOS_CARNETS.slice(TOP_N).map(x => x.nombre).join(', ');

const CARNETS_DATA = [
  ...top8,
  { nombre: "Otros", valor: otrosValor },
].map((c, i) => ({ ...c, color: COLORES[i] }));

// ─── Ingresos ficticios por mes ───────────────────────────────────────────────

const INGRESOS_DATA = [
  { mes: "Ene", ingresos: 3820 },
  { mes: "Feb", ingresos: 4150 },
  { mes: "Mar", ingresos: 5340 },
  { mes: "Abr", ingresos: 4870 },
  { mes: "May", ingresos: 6120 },
  { mes: "Jun", ingresos: 7450 },
  { mes: "Jul", ingresos: 6890 },
  { mes: "Ago", ingresos: 5230 },
  { mes: "Sep", ingresos: 7810 },
  { mes: "Oct", ingresos: 8340 },
  { mes: "Nov", ingresos: 7620 },
  { mes: "Dic", ingresos: 9150 },
];

// ─── Gráfica barras alumnos ───────────────────────────────────────────────────

function GraficaBarras({ datos, etiquetas, color }) {
  if (!datos || datos.every(v => v === 0)) {
    return <div className="grafica-vacia">Sin datos registrados para este año</div>;
  }
  const chartData = etiquetas.map((mes, i) => ({ mes, alumnos: datos[i] ?? 0 }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: '#fff', fontSize: 13, fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Poppins' }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
        <Tooltip
          contentStyle={{ background: '#011a3d', border: '1px solid #00417e', borderRadius: '8px', fontFamily: 'Poppins', fontSize: '13px', color: '#fff' }}
          cursor={{ fill: 'rgba(255,255,255,0.06)' }}
          formatter={(v) => [v, 'Alumnos']}
          labelStyle={{ color: '#fff', fontWeight: 900 }}
          itemStyle={{ color: '#fff', fontFamily: 'Poppins' }}
        />
        <Bar dataKey="alumnos" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((_, i) => <Cell key={i} fill={color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Tooltip pastel ───────────────────────────────────────────────────────────

function TooltipPastel({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { nombre, valor } = payload[0].payload;
  const total = CARNETS_DATA.reduce((s, c) => s + c.valor, 0);
  return (
    <div style={{ background: '#011a3d', border: '1px solid #00417e', borderRadius: '8px', padding: '8px 14px', fontFamily: 'Poppins', fontSize: '13px', color: '#fff' }}>
      <p style={{ margin: 0, fontWeight: 700 }}>Carnet {nombre}</p>
      <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)' }}>
        {valor} matrículas · {((valor / total) * 100).toFixed(1)}%
      </p>
    </div>
  );
}

// ─── Label % dentro del sector ────────────────────────────────────────────────

function LabelPastel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null;
  const RAD = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.58;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontFamily="Poppins" fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ─── Leyenda custom en cuadrícula 2 columnas ──────────────────────────────────

function LeyendaCarnets() {
  const total = CARNETS_DATA.reduce((s, c) => s + c.valor, 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 16px', padding: '8px 4px 0' }}>
      {CARNETS_DATA.map((c) => (
        <div key={c.nombre} style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
          <span style={{ flexShrink: 0, width: 9, height: 9, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
          <span style={{ fontFamily: 'Poppins', fontSize: '11px', color: 'rgba(255,255,255,0.82)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
            {c.nombre === "Otros" ? `Otros (${otrosNombres})` : `Carnet ${c.nombre}`}
          </span>
          <span style={{ fontFamily: 'Poppins', fontSize: '10px', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
            {((c.valor / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Gráfica pastel ───────────────────────────────────────────────────────────

function GraficaPastel() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={175}>
        <PieChart>
          <Pie
            data={CARNETS_DATA}
            dataKey="valor"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={30}
            paddingAngle={2}
            labelLine={false}
            label={LabelPastel}
          >
            {CARNETS_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<TooltipPastel />} />
        </PieChart>
      </ResponsiveContainer>
      <LeyendaCarnets />
    </div>
  );
}

// ─── Tooltip ingresos ─────────────────────────────────────────────────────────

function TooltipIngresos({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#011a3d', border: '1px solid #00417e', borderRadius: '8px', padding: '8px 14px', fontFamily: 'Poppins', fontSize: '13px', color: '#fff' }}>
      <p style={{ margin: 0, fontWeight: 700 }}>{label}</p>
      <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.85)' }}>
        {payload[0].value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

// ─── Gráfica barras ingresos ──────────────────────────────────────────────────

function GraficaIngresos() {
  const max = Math.max(...INGRESOS_DATA.map(d => d.ingresos));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={INGRESOS_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={46} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
        <Tooltip content={<TooltipIngresos />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
        <Bar dataKey="ingresos" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {INGRESOS_DATA.map((entry, i) => (
            <Cell key={i} fill={entry.ingresos === max ? '#00d4aa' : '#3b9eff'} opacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

export function GraficasPanel() {
  const [alumnos, setAlumnos] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch("http://localhost:9002/usuarios/todosdto/3", { method: "GET", headers });
        if (res.ok) setAlumnos(await res.json());
      } catch (e) {
        console.log("Error cargando alumnos", e);
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

  const añosConDatos = [...new Set(alumnos.map(parsearAño).filter(Boolean))].sort((a, b) => a - b);
  const añosDisponibles = añosConDatos.length > 0 ? añosConDatos : [new Date().getFullYear()];
  const añoFinal = añosDisponibles.includes(añoSeleccionado) ? añoSeleccionado : añosDisponibles[0];

  const conteo = {};
  alumnos.forEach(alumno => {
    const año = parsearAño(alumno);
    const mes = parsearMes(alumno);
    if (!año || !mes || año !== añoFinal) return;
    conteo[mes] = (conteo[mes] || 0) + 1;
  });

  const alumnosPorMes = MESES_NOMBRES.map((_, i) => conteo[i + 1] || 0);
  const idxActual = añosDisponibles.indexOf(añoFinal);
  const puedeRetroceder = idxActual > 0;
  const puedeAvanzar = idxActual < añosDisponibles.length - 1;

  const totalIngresos = INGRESOS_DATA.reduce((s, d) => s + d.ingresos, 0)
    .toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const btnStyle = (activo) => ({
    background: 'none', border: 'none',
    color: activo ? '#fff' : 'rgba(255,255,255,0.25)',
    fontSize: '20px', cursor: activo ? 'pointer' : 'default',
    padding: '0 4px', lineHeight: 1,
  });

  return (
    <div className="graficas-panel">

      {/* ── 1. Alumnos por mes ── */}
      <div className="grafica-bloque">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Alumnos registrados por mes</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => puedeRetroceder && setAñoSeleccionado(añosDisponibles[idxActual - 1])} disabled={!puedeRetroceder} style={btnStyle(puedeRetroceder)}>‹</button>
            <span style={{ color: '#fff', fontFamily: 'Poppins', fontSize: '14px', fontWeight: 600, minWidth: '44px', textAlign: 'center' }}>{añoFinal}</span>
            <button onClick={() => puedeAvanzar && setAñoSeleccionado(añosDisponibles[idxActual + 1])} disabled={!puedeAvanzar} style={btnStyle(puedeAvanzar)}>›</button>
          </div>
        </div>
        <div className="grafica-contenido">
          <GraficaBarras datos={alumnosPorMes} etiquetas={MESES_NOMBRES} color="#ffffff" />
        </div>
      </div>

      {/* ── 2. Carnets más vendidos ── */}
      <div className="grafica-bloque grafica-bloque--doble">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Carnets más vendidos</h3>
          <span className="grafica-subtitulo">Distribución total · datos de ejemplo</span>
        </div>
        <div className="grafica-contenido">
          <GraficaPastel />
        </div>
      </div>

      
      <div className="grafica-bloque grafica-bloque--full">
        <div className="grafica-cabecera">
          <h3 className="grafica-titulo">Ingresos por mes</h3>
          <span className="grafica-subtitulo">Total anual: {totalIngresos} · datos de ejemplo</span>
        </div>
        <div className="grafica-contenido">
          <GraficaIngresos />
        </div>
      </div>

    </div>
  );
}