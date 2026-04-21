import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../admin/DashboardAdmin.css";   
import "./DashboardAlumno.css";    
import CalendarioExamenes from "../Components/CalendarioExamenes";
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth"

// componente del perfil del usuario con su fotito de perfil 
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
        ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}  onChange={(e) => {
          const archivo = e.target.files[0]; 
          if (archivo) {
            const lector = new FileReader(); lector.onload = (ev) => onImagenCambio(ev.target.result);
            lector.readAsDataURL(archivo);  
          }
        }}
        />
    </div>
  );
}

// modal con los datos personales del alumno
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
    { key: "usuario",     label: "Usuario",     icono: "/imagenes/perfil.png"   },
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


// tarjetita carnet
//aqui en vez de una tabla viendo modelos de dashboard para un alumno es mejor enseñarle la información 
// de forma más grafica y lo más importarnte si quieres añadirle otro campo adelante yo puse esos 4 si te parece bien cualquier me dices okis
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
        <div className="alum-info-fila">
          <span className="alum-info-label">Tipo de carnet</span>
          <span className="alum-info-valor">{matricula?.tipoCarnet ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Tipo de paquete</span>
          <span className="alum-info-valor">{matricula?.tipoPaquete ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Clases de conducir</span>
          <span className="alum-info-valor">{matricula?.gestionesClases ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Clases especiales</span>
          <span className={`alum-badge ${matricula?.clasesEspeciales ? "alum-badge--si" : "alum-badge--no"}`}>
            {matricula?.clasesEspeciales ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}


// tarjeta sobre el veehiculo 
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
        <div className="alum-info-fila">
          <span className="alum-info-label">Marca</span>
          <span className="alum-info-valor alum-info-valor--destacado">{vehiculo?.marca ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Modelo</span>
          <span className="alum-info-valor">{vehiculo?.modelo ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Tipo</span>
          <span className="alum-info-valor">{vehiculo?.tipo ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Remolque</span>
          <span className={`alum-badge ${vehiculo?.remolque ? "alum-badge--si" : "alum-badge--no"}`}>
            {vehiculo?.remolque ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}


// tarjeta para mostrar los datos de que profesor esta asignado el alumno
function TarjetaProfesor({ profesor }) {
  return (
    <div className="alum-tarjeta alum-tarjeta--profesor">
      <div className="alum-tarjeta-header">
        <div className="alum-tarjeta-icono-wrap alum-tarjeta-icono-wrap--profesor">
          <img src="/imagenes/profesor.png" alt="profesor" className="alum-tarjeta-icono" />
        </div>
        <span className="alum-tarjeta-titulo">Profesor</span>
      </div>
      <div className="alum-profesor-avatar-zona">
        <img src="/imagenes/profesor.jpg" alt="profesor" className="alum-profesor-foto" />
        <div>
          <p className="alum-profesor-nombre">{profesor?.nombre ?? "---"} {profesor?.apellidos ?? ""}</p>
          <p className="alum-profesor-email">{profesor?.email ?? "---"}</p>
        </div>
      </div>

      <div className="alum-tarjeta-cuerpo">
        <div className="alum-info-fila">
          <span className="alum-info-label">Email</span>
          <span className="alum-info-valor">{profesor?.email ?? "---"}</span>
        </div>
        <div className="alum-info-fila">
          <span className="alum-info-label">Teléfono</span>
          <span className="alum-info-valor">{profesor?.telefono ?? "---"}</span>
        </div>
      </div>
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


// tarjeta de examenes resumido el teorico y el práctico 
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
        <div className="alum-examen-item alum-examen-item--teorico">
          <div className="alum-examen-dot alum-examen-dot--teorico"></div>
          <div>
            <p className="alum-examen-tipo">Examen Teórico</p>
            <p className="alum-examen-fecha">{formatFecha(matricula?.fechaTeorico)}</p>
          </div>
        </div>
        <div className="alum-examen-separador"></div>

        <div className="alum-examen-item alum-examen-item--practico">
          <div className="alum-examen-dot alum-examen-dot--practico"></div>
          <div>
            <p className="alum-examen-tipo">Examen Práctico</p>
            <p className="alum-examen-fecha">{formatFecha(matricula?.fechaPractico)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function DashboardAlumno() {
  const username = obtenerUsername();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("informacion");
  const [modalUsuario, setModalUsuario] = useState(false);
  const [matricula,   setMatricula]   = useState(null); 
  const [vehiculo,    setVehiculo]    = useState(null); 
  const [profesor,    setProfesor]    = useState(null); 
  const [infoUsuario, setInfoUsuario] = useState(null); 


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
        const res = await fetch(`http://localhost:9002/usuarios/datos/${username}`, {
          method: "GET", headers
        });
        if (res.ok) setInfoUsuario(await res.json());
      } catch (e) { console.log("Error fetch usuario", e); }
    };
    cargar();
  }, []);

//para la matricula de alumno
  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/matricula/alumno/${username}`, {
          method: "GET", headers
        });
        if (res.ok) setMatricula(await res.json());
      } catch (e) { console.log("Error fetch matrícula", e); }
    };
    cargar();
  }, []);


  // para el vehiculo asignado 
  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/vehiculo/alumno/${username}`, {
          method: "GET", headers
        });
        if (res.ok) setVehiculo(await res.json());
      } catch (e) { console.log("Error fetch vehículo", e); }
    };
    cargar();
  }, []);

//para el profesor al que esta asignado el alumno
  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/matricula/profesor-de-alumno/${username}`, {
          method: "GET", headers
        });
        if (res.ok) setProfesor(await res.json());
      } catch (e) { console.log("Error fetch profesor", e); }
    };
    cargar();
  }, []);


  const handleVistaActiva = (key) => {
    if (key === "usuario") {
      setModalUsuario(true);   
    } else {
      setVistaActiva(key);     
    }
  };



  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());
  const eventosCalendario = matricula
    ? [{ nombre: nombreCompleto, apellidos: "", fechaTeorico: matricula.fechaTeorico, fechaPractico: matricula.fechaPractico }]
    : [];

return(
    <div className="dashboard-contenedor">
      <NavLateralAlumno vistaActiva={vistaActiva} setVistaActiva={handleVistaActiva} />

      <div className="dashboard-main">
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
          <div className="alum-grid-tarjetas">
            <TarjetaCarnet   matricula={matricula} />
            <TarjetaVehiculo vehiculo={vehiculo}   />
            <TarjetaProfesor profesor={profesor}   />
            <TarjetaExamenes matricula={matricula} />
          </div>
          <CalendarioExamenes
            alumnos={eventosCalendario}
            consulta="" 
          />
        </div>
      </div>

      <ModalUsuario
        visible={modalUsuario}
        usuario={infoUsuario}
        onCerrar={() => setModalUsuario(false)}   
      />
    </div>
  );
}

export default DashboardAlumno;