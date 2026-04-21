import { useState, useEffect } from "react";
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth";


export default function CalendarioExamenes({ alumnos: alumnosProp, fetchUrl, consulta = "" }) {
  const [alumnos, setAlumnos] = useState(alumnosProp ?? []);

  useEffect(() => {
    if (alumnosProp !== undefined) {
      setAlumnos(alumnosProp);
      return;
    }
    if (!fetchUrl) return;
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(fetchUrl, { method: "GET", headers });
        if (res.ok) setAlumnos(await res.json());
      } catch (e) {
        console.log("CalendarioExamenes fetch error", e);
      }
    };
    cargar();
  }, [alumnosProp, fetchUrl]);

  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const nombresMes = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  const offsetInicio = (primerDia.getDay() + 6) % 7;


  const eventosPorDia = {};
  alumnos.forEach((a) => {
    const nombre = a.nombreAlumno
      ? `${a.nombreAlumno} ${a.apellidosAlumno}`
      : `${a.nombre ?? ""} ${a.apellidos ?? ""}`.trim();

    if (a.fechaTeorico) {
      if (!eventosPorDia[a.fechaTeorico]) eventosPorDia[a.fechaTeorico] = [];
      eventosPorDia[a.fechaTeorico].push({ tipo: "teorico", nombre });
    }
    if (a.fechaPractico) {
      if (!eventosPorDia[a.fechaPractico]) eventosPorDia[a.fechaPractico] = [];
      eventosPorDia[a.fechaPractico].push({ tipo: "practico", nombre });
    }
  });

  const filtro = consulta.toLowerCase().trim();
  const celdas = [];
  for (let i = 0; i < offsetInicio; i++) celdas.push(null);
  for (let d = 1; d <= ultimoDia.getDate(); d++) celdas.push(d);

  const toKey = (d) => {
    const mm = String(mes + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${anio}-${mm}-${dd}`;
  };
  const esHoy = (d) =>
    d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();

  const prevMes = () => {
    if (mes === 0) { setMes(11); setAnio(anio - 1); }
    else setMes(mes - 1);
  };
  const nextMes = () => {
    if (mes === 11) { setMes(0); setAnio(anio + 1); }
    else setMes(mes + 1);
  };

  return (
    <div className="cal-bloque">
      <div className="cal-cabecera">
        <h2 className="cal-titulo">Calendario de exámenes</h2>
        <div className="cal-leyenda">
          <span className="cal-ley-item">
            <span className="cal-dot cal-dot--teorico"></span> Teórico
          </span>
          <span className="cal-ley-item">
            <span className="cal-dot cal-dot--practico"></span> Práctico
          </span>
        </div>
      </div>

      <div className="cal-cuerpo">
        <div className="cal-nav">
          <button className="cal-btn" onClick={prevMes}>‹</button>
          <span className="cal-mes-label">{nombresMes[mes]} {anio}</span>
          <button className="cal-btn" onClick={nextMes}>›</button>
        </div>

        <div className="cal-grid-semana">
          {diasSemana.map((d) => (
            <div key={d} className="cal-header-dia">{d}</div>
          ))}
        </div>

        <div className="cal-grid">
          {celdas.map((dia, idx) => {
            if (!dia) return <div key={`e-${idx}`} className="cal-celda cal-celda--vacia" />;

            const key = toKey(dia);
            const eventos = eventosPorDia[key] || [];
            const eventosFiltrados = filtro
              ? eventos.filter((ev) => ev.nombre.toLowerCase().includes(filtro))
              : eventos;
            const tieneResaltado = filtro && eventosFiltrados.length > 0;

            return (
              <div
                key={key}
                className={[
                  "cal-celda",
                  esHoy(dia)
                    ? "cal-celda--hoy" : "",
                  tieneResaltado
                    ? "cal-celda--resaltada" : "",
                ].join(" ")}
              >
                <span className="cal-num">{dia}</span>
                <div className="cal-eventos">
                  {eventos.map((ev, i) => {
                    const dimmed = filtro && !ev.nombre.toLowerCase().includes(filtro);
                    return (
                      <div
                        key={i}
                        className={[
                          "cal-evento",
                          `cal-evento--${ev.tipo}`,
                          dimmed ? "cal-evento--dimmed" : "",
                        ].join(" ")}
                        title={`${ev.nombre} — ${ev.tipo === "teorico" ? "Examen teórico" : "Examen práctico"}`}
                      >
                        <span className="cal-evento-nombre">{ev.nombre.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
