import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../admin/DashboardAdmin.css";
import "./DashboardProfesor.css"; 
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth";


function formatDate(str) {
  if (!str) return "—";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
}
export function TopbarPerfil({imagenPerfil, onImagenCambio, nombreCompleto, username }) {
  const inputRef = useRef(null);

  return (
    <div
      className="topbar-perfil-usuario"
      onClick={() => inputRef.current?.click()} 
      title="Cambiar foto de perfil"
    >
      <div className="topbar-avatar-wrapper">
        {imagenPerfil
          ? <img src={imagenPerfil} alt="perfil" className="topbar-avatar-img" />
          : <img src="/imagenes/sinfoto.jpg" alt="perfil" className="topbar-avatar-img" />
        }
        <div className="topbar-avatar-overlay"><span></span></div>
      </div>
      <div className="topbar-perfil-info" style={{ alignItems: "flex-start" }}>
        <span className="topbar-perfil-nombre">{nombreCompleto}</span>
        <span className="topbar-perfil-correo">{username}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const archivo = e.target.files[0];
          if (archivo) {
            const lector = new FileReader();
            lector.onload = (ev) => onImagenCambio(ev.target.result);
            lector.readAsDataURL(archivo);
          }
        }}
      />
    </div>
  );
}

function NavLateralProfesor() {
  return (
    <aside className="sidebar-lateral">
      <div className="sidebar-logo-zona">
        <img src="/imagenes/footer.png" alt="logo" className="sidebar-logo-img" />
        <div className="sidebar-logo-texto">
          <span className="sidebar-logo-autoescuela">AUTOESCUELA</span>
          <div className="sidebar-logo-linea"></div>
          <span className="sidebar-logo-villarey">VILLAREY</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-seccion-titulo">MIS ALUMNOS</p>
        <button className="sidebar-nav-item sidebar-nav-item--activo">
          <span className="sidebar-nav-icono">
            <img src="/imagenes/alumno.png" alt="Alumnos" className="sidebar-icon-img" />
          </span>
          <span className="sidebar-nav-label">Alumnos</span>
        </button>
        
           <p className="sidebar-nav-seccion-titulo">Perfil</p>
         <button className="sidebar-nav-item sidebar-nav-item--activo">
          <span className="sidebar-nav-icono">
            <img src="/imagenes/perfil.png" alt="Alumnos" className="sidebar-icon-img" />
          </span>
          <span className="sidebar-nav-label">perfil</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-cerrar-sesion">
          <span className="sidebar-cerrar-icono">↩</span>
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}

function BarraBusqueda({ onConsultaCambio }) {
  const [consulta, setConsulta] = useState("");
  return (
    <div className="barra-busqueda-wrapper">
      <div className="barra-busqueda-input-zona">
        <div className="barra-busqueda-icono-wrapper">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="barra-busqueda-svg">
            <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
          </svg>
        </div>
        <input
          className="barra-busqueda-input"
          type="text"
          placeholder="Buscar por nombre y apellido"
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value);
            onConsultaCambio(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

//tarjeta de alumnos asignados-------------------------------------------------------------------------------------
function TarjetaAlumnosProfesor({ total }) {
  return (
    <div className="prof-tarjeta-alumnos">
      <div className="prof-tarjeta-icono-zona">
        <img src="/imagenes/alumno.png" alt="alumnos" className="prof-tarjeta-icono-img" />
      </div>
      <div className="prof-tarjeta-datos">
        <span className="prof-tarjeta-numero">{total ?? "—"}</span>
        <span className="prof-tarjeta-label">Alumnos asignados</span>
      </div>
      <div className="prof-tarjeta-barra"></div>
    </div>
  );
}
function TablaAlumnosProfesor({ alumnos = [], consulta = "" }) {

  const filtrados = alumnos.filter((a) => {
    const texto = `${a.nombreAlumno ?? ""} ${a.apellidosAlumno ?? ""}`.toLowerCase();
    return texto.includes(consulta.toLowerCase());
  });

  return (
    <div className="tabla-bloque">
      <div className="tabla-cabecera">
        <h2 className="tabla-titulo">Alumnos asignados</h2>
      </div>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>F.Teórico</th>
              <th>F.Práctico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="tabla-vacia">
                  {consulta ? "No se encontraron resultados." : "Sin datos — conecta con el backend."}
                </td>
              </tr>
            ) : (
              filtrados.map((a, i) => (
                <tr key={i} className="tabla-fila">
                  <td>{a.nombreAlumno}</td>
                  <td>{a.apellidosAlumno}</td>
                  <td>{a.usernameAlumno}</td>
                  <td>
                    <span className="prof-fecha-badge prof-fecha-badge--teorico">
                      {formatDate(a.fechaTeorico)}
                    </span>
                  </td>
                  <td>
                    <span className="prof-fecha-badge prof-fecha-badge--practico">
                      {formatDate(a.fechaPractico)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Calendario({ alumnos = [], consulta = "" }) {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const nombresMes = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sabádo","Domingo"];
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  const offsetInicio = (primerDia.getDay() + 6) % 7;
  const eventosPorDia = {};
  alumnos.forEach((a) => {
    const nombre = `${a.nombreAlumno} ${a.apellidosAlumno}`;
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
          <button
            className="cal-btn"
            onClick={() => {
              if (mes === 0) { setMes(11); setAnio(anio - 1); }
              else setMes(mes - 1);
            }}
          >‹</button>

          <span className="cal-mes-label">{nombresMes[mes]} {anio}</span>

          <button
            className="cal-btn"
            onClick={() => {
              if (mes === 11) { setMes(0); setAnio(anio + 1); }
              else setMes(mes + 1);
            }}
          >›</button>
        </div>
        <div className="cal-grid-semana">
          {diasSemana.map((d) => (
            <div key={d} className="cal-header-dia">{d}</div>
          ))}
        </div>
        <div className="cal-grid">
          {celdas.map((dia, idx) => {

          
            if (!dia) return (
              <div key={`e-${idx}`} className="cal-celda cal-celda--vacia" />
            );
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
                  esHoy(dia) ? "cal-celda--hoy" : "",        
                  tieneResaltado ? "cal-celda--resaltada" : "",
                ].join(" ")}
              >  
                <span className="cal-num">{dia}   </span>

          
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

function AlertaFlotante({ mensaje, tipo, visible }) {
  if (!visible) return null;
  return (
    <div className={`alerta-flotante alerta-flotante--${tipo}`}>
      {mensaje}
    </div>
  );
}

function DashboardProfesor() {

  const [alumnos, setAlumnos] = useState([]);
  const [consulta, setConsulta] = useState("");
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "exito" });

  const username = obtenerUsername();
  const [nombreCompleto, setNombreCompleto] = useState("");


  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/usuarios/nombre/${username}`, { method: "GET", headers });
        if (res.ok) setNombreCompleto(await res.text());
      } catch (e) { console.log("Error fetch nombre", e); }
    };
    cargar();
  }, []);

  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/matricula/alumnos-de-profesor/${username}`, { method: "GET", headers });
        if (res.ok) setAlumnos(await res.json());
      } catch (e) { console.log("Error fetch alumnos", e); }
    };
    cargar();
  }, []);

  const mostrarAlerta = (mensaje, tipo = "exito") => {
    setAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => setAlerta((a) => ({ ...a, visible: false })), 3000);
  };

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="dashboard-contenedor">
      <NavLateralProfesor />

      <div className="dashboard-main">
        <AlertaFlotante   mensaje={alerta.mensaje} tipo={alerta.tipo} visible={alerta.visible} />

      
        <div
         className="dashboard-topbar">
          <div>
            <p className="topbar-saludo-texto">
              Bienvenido, <span className=  "topbar-saludo-nombre">{nombreCompleto}</span>
            </p>
            <p className="topbar-saludo-sub"> {fechaHoy}</p>
          </div>
          <div className="topbar-acciones">
            <BarraBusqueda onConsultaCambio=  {setConsulta} />
            <TopbarPerfil
              nombreCompleto={nombreCompleto}
              username={username}
              imagenPerfil={imagenPerfil}
              onImagenCambio=   {setImagenPerfil}
            />
          </div>
        </div>

        <div className="dashboard-cuerpo">

          <div className="prof-fila-principal">
            <TarjetaAlumnosProfesor total={alumnos.length} />
            <div className="prof-tabla-zona">
              <TablaAlumnosProfesor alumnos={alumnos} consulta={consulta} />
            </div>
          </div>

          <Calendario alumnos={alumnos} consulta={consulta} />
        </div>
      </div>
    </div>
  );
}

export default DashboardProfesor;