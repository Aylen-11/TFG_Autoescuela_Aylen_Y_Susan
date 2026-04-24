import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../admin/DashboardAdmin.css";
import "./DashboardAlumno.css";
import CalendarioExamenes from "../Components/CalendarioExamenes";
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth";
import { MisDatos } from "../Components/Modales";

function TopbarPerfil({ imagenPerfil, onImagenCambio, nombreCompleto, username }) {
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
        ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
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

// modal con los datos personales del alumnoo
function ModalUsuario({ visible, usuario, onCerrar }) {
  if (!visible || !usuario) return null;
  return (
    <div className="alum-modal-overlay" onClick={onCerrar}>
      <div className="alum-modal" onClick={(e) => e.stopPropagation()}>
        <button className="alum-modal-cerrar" onClick={onCerrar}>✕</button>

        <div className="alum-modal-avatar">
          <img src="/imagenes/sinfoto.jpg" alt="perfil" />
        </div>

        <h3 className="alum-modal-nombre">{usuario.nombre} {usuario.apellidos}</h3>
        <span className="alum-modal-username">{usuario.username}</span>

        <div className="alum-modal-grid">
          <div className="alum-modal-item">
            <span className="alum-modal-label">DNI</span>
            <span className="alum-modal-valor">{usuario.dni ?? "---"}</span>
          </div>
          <div className="alum-modal-item">
            <span className="alum-modal-label">Teléfono</span>
            <span className="alum-modal-valor">{usuario.telefono ?? "---"}</span>
          </div>
          <div className="alum-modal-item">
            <span className="alum-modal-label">Fecha nacimiento</span>
            <span className="alum-modal-valor">{usuario.fechaNacimiento ?? "---"}</span>
          </div>
          <div className="alum-modal-item">
            <span className="alum-modal-label">Dirección</span>
            <span className="alum-modal-valor">{usuario.direccion ?? "---"}</span>
          </div>
          <div className="alum-modal-item alum-modal-item--full">
            <span className="alum-modal-label">Fecha de registro</span>
            <span className="alum-modal-valor">{usuario.fechaRegistro ?? "---"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// componente del la nav lateral con los datos de que ocupa ver solo el alumno 
function NavLateralAlumno({ vistaActiva, setVistaActiva }) {
  const items = [
    { key: "informacion", label: "Información", icono: "/imagenes/dasboard.png" },
    { key: "mis-datos",   label: "Mis datos",   icono: "/imagenes/perfil.png"   },
  ];

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
        <p className="sidebar-nav-seccion-titulo">MI CUENTA</p>
        {items.map(({ key, label, icono }) => (
          <button
            key={key}
            className={`sidebar-nav-item ${vistaActiva === key ? "sidebar-nav-item--activo" : ""}`}
            onClick={() => setVistaActiva(key)}
          >
            <span className="sidebar-nav-icono">
              <img src={icono} alt={label} className="sidebar-icon-img" />
            </span>
            <span className="sidebar-nav-label">{label}</span>
          </button>
        ))}
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

function TarjetaCarnet({ matricula }) {
  return (
    <div className="alum-tarjeta alum-tarjeta--carnet">
      <div className="alum-tarjeta-header">
        <div className="alum-tarjeta-icono-wrap alum-tarjeta-icono-wrap--carnet">
          <img src="/imagenes/alumno.png" alt="carnet" className="alum-tarjeta-icono" />
        </div>
        <span className="alum-tarjeta-titulo">Mi Carnet</span>
      </div>
      <div className="alum-tarjeta-cuerpo">
        {matricula?.map((m, i) => (
          <div key={i}>
            <div className="alum-info-fila">
              <span className="alum-info-label">Tipo de carnet</span>
              <span className="alum-info-valor">{m?.tiposCarnet ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Tipo de paquete</span>
              <span className="alum-info-valor">{m?.tipoPaquete ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Clases de conducir</span>
              <span className="alum-info-valor">{m?.clasesConducir ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Clases especiales</span>
              <span className="alum-info-valor">{m?.clasesEspeciales ?? "---"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TarjetaVehiculo({ vehiculo }) {
  return (
    <div className="alum-tarjeta alum-tarjeta--vehiculo">
      <div className="alum-tarjeta-header">
        <div className="alum-tarjeta-icono-wrap alum-tarjeta-icono-wrap--vehiculo">
          <img src="/imagenes/vehiculo.png" alt="vehiculo" className="alum-tarjeta-icono" />
        </div>
        <span className="alum-tarjeta-titulo">Vehículo Asignado</span>
      </div>
      {vehiculo?.imagen && (
        <div className="alum-vehiculo-img-wrap">
          <img src={vehiculo.imagen} alt="vehículo" className="alum-vehiculo-img" />
        </div>
      )}
      <div className="alum-tarjeta-cuerpo">
        {vehiculo?.map((v, i) => (
          <div key={i}>
            <div className="alum-info-fila">
              <span className="alum-info-label">Nº de vehiculo</span>
              <span className="alum-info-valor alum-info-valor--destacado">{v?.idVehiculo ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Marca</span>
              <span className="alum-info-valor alum-info-valor--destacado">{v?.marca ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Modelo</span>
              <span className="alum-info-valor">{v?.marca ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Tipo</span>
              <span className="alum-info-valor">{v?.tipo ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Remolque</span>
              <span className={`alum-badge ${v?.remolque ? "alum-badge--si" : "alum-badge--no"}`}>
                {v?.remolque ? "Sí" : "No"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TarjetaProfesor({ profesor }) {
  return (
    <div className="alum-tarjeta alum-tarjeta--profesor">
      {profesor?.map((p, i) => (
        <div key={i}>
          <div className="alum-tarjeta-header">
            <div className="alum-tarjeta-icono-wrap alum-tarjeta-icono-wrap--profesor">
              <img src="/imagenes/profesor.png" alt="profesor" className="alum-tarjeta-icono" />
            </div>
            <span className="alum-tarjeta-titulo">Profesor</span>
          </div>
          <div className="alum-profesor-avatar-zona">
            <img src="/imagenes/profesor.jpg" alt="profesor" className="alum-profesor-foto" />
            <div>
              <p className="alum-profesor-nombre">{p?.nombre ?? "---"} {p?.apellidos ?? ""}</p>
              <p className="alum-profesor-email">{p?.username ?? "---"}</p>
            </div>
          </div>
          <div className="alum-tarjeta-cuerpo">
            <div className="alum-info-fila">
              <span className="alum-info-label">Email</span>
              <span className="alum-info-valor">{p?.username ?? "---"}</span>
            </div>
            <div className="alum-info-fila">
              <span className="alum-info-label">Teléfono</span>
              <span className="alum-info-valor">{p?.telefono ?? "---"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatFecha(str) {
  if (!str) return "---";                          // si no hay fecha no devuelve nada osea ---
  const [y, m, d] = str.split("---");            
  const fecha = new Date(y, m - 1, d);          
  return fecha.toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric",
    month: "long", year: "numeric"
  }).replace(/^\w/, (c) => c.toUpperCase());
}

function TarjetaExamenes({ matricula }) {
  return (
    <div className="alum-tarjeta alum-tarjeta--examenes">
      <div className="alum-tarjeta-header">
        <div className="alum-tarjeta-icono-wrap alum-tarjeta-icono-wrap--examenes">
          <img src="/imagenes/calendario.png" alt="carnet" className="alum-tarjeta-icono" />
        </div>
        <span className="alum-tarjeta-titulo">Próximos Exámenes</span>
      </div>
      <div className="alum-tarjeta-cuerpo">
        {matricula?.map((m, i) => (
          <div key={i}>
            <div className="alum-examen-item alum-examen-item--teorico">
              <div className="alum-examen-dot alum-examen-dot--teorico"></div>
              <div>
                <p className="alum-examen-tipo">Examen Teórico</p>
                <p className="alum-examen-fecha">{formatFecha(m?.fechaTeorico)}</p>
              </div>
            </div>
            <div className="alum-examen-separador"></div>
            <div className="alum-examen-item alum-examen-item--practico">
              <div className="alum-examen-dot alum-examen-dot--practico"></div>
              <div>
                <p className="alum-examen-tipo">Examen Práctico</p>
                <p className="alum-examen-fecha">{formatFecha(m?.fechaPractico)}</p>
              </div>
            </div>
          </div>
        ))}
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

function DashboardAlumno() {
  const username = obtenerUsername();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("informacion");
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "exito" });
  const [matricula, setMatricula] = useState([]);
  const [vehiculo, setVehiculo] = useState([]);
  const [profesor, setProfesor] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/usuarios/nombre/${username}`, {
          method: "GET", headers
        });
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
        const res = await fetch(`http://localhost:9002/matricula/info/${username}`, {
          method: "GET", headers
        });
        if (res.ok) setMatricula(await res.json());
      } catch (e) { console.log("Error fetch matrícula", e); }
    };
    cargar();
  }, []);

  useEffect(() => {
    if (!matricula || matricula.length === 0) return;
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const resultados = await Promise.all(
          matricula.map(m =>
            fetch(`http://localhost:9002/vehiculo/uno/${m.idVehiculo}`, { method: "GET", headers })
              .then(res => res.ok ? res.json() : null)
          )
        );
        setVehiculo(resultados.filter(Boolean));
      } catch (e) { console.log("Error fetch vehículos", e); }
    };
    cargar();
  }, [matricula]);

  useEffect(() => {
    if (!matricula || matricula.length === 0) return;
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const resultados = await Promise.all(
          matricula.map(m =>
            fetch(`http://localhost:9002/usuarios/usuario-username-dto/${m.usernameProfesor}`, { method: "GET", headers })
              .then(res => res.ok ? res.json() : null)
          )
        );
        setProfesor(resultados.filter(Boolean));
      } catch (e) { console.log("Error fetch profesor", e); }
    };
    cargar();
  }, [matricula]);

  const mostrarAlerta = (mensaje, tipo = "exito") => {
    setAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => setAlerta((a) => ({ ...a, visible: false })), 3000);
  };

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());

  const eventosCalendario = matricula.length > 0
    ? matricula.map(m => ({
        nombre: nombreCompleto,
        apellidos: "",
        fechaTeorico: m.fechaTeorico,
        fechaPractico: m.fechaPractico
      }))
    : [];

  return (
    <div className="dashboard-contenedor">
      <NavLateralAlumno vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <div className="dashboard-main">
        <AlertaFlotante mensaje={alerta.mensaje} tipo={alerta.tipo} visible={alerta.visible} />

        <div className="dashboard-topbar">
          <div>
            <p className="topbar-saludo-texto">
              Bienvenido, <span className="topbar-saludo-nombre">{nombreCompleto}</span>
            </p>
            <p className="topbar-saludo-sub">{fechaHoy}</p>
          </div>
          <div className="topbar-acciones">
            <TopbarPerfil
              nombreCompleto={nombreCompleto}
              username={username}
              imagenPerfil={imagenPerfil}
              onImagenCambio={setImagenPerfil}
            />
          </div>
        </div>

        <div className="dashboard-cuerpo">
          {vistaActiva === "informacion" && (
            <>
              <div className="alum-grid-tarjetas">
                <TarjetaCarnet matricula={matricula} />
                <TarjetaVehiculo vehiculo={vehiculo} />
                <TarjetaProfesor profesor={profesor} />
                <TarjetaExamenes matricula={matricula} />
              </div>
              <CalendarioExamenes alumnos={eventosCalendario} consulta="" />
            </>
          )}

          {vistaActiva === "mis-datos" && (
            <MisDatos mostrarAlerta={mostrarAlerta} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardAlumno;