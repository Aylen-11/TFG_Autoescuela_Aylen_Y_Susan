import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./DashboardProfesor.css";

function NavAzul() {
  return (
    <nav className="nav-dashboard">
      <div className="nav-dashboard-logo">
        <img src="/imagenes/footer.png" alt="logo" className="nav-dashboard-img" />
        <div className="nav-dashboard-texto">
          <span className="nav-dashboard-autoescuela">AUTOESCUELA</span>
          <div className="nav-dashboard-linea"></div>
          <span className="nav-dashboard-villarey">VILLAREY</span>
        </div>
      </div>
      <div className="nav-dashboard-titulo"></div>
      <Link to="/" className="nav-dashboard-cerrar">
        Cerrar Sesión
      </Link>
    </nav>
  );
}

function PanelLateral({ profesor, totalAlumnos }) {
  return (
    <aside className="panel-lateral">
      <div className="panel-avatar">
        <div className="panel-icono-avatar"></div>
        <h3 className="panel-rol-nombre">
          {profesor ? `${profesor.nombre} ${profesor.apellido}` : "Profesor"}
        </h3>
        <p className="panel-rol-email">{profesor?.username ?? ""}</p>
        <p className="panel-rol-desc">Panel de Profesor</p>
      </div>

      <div className="panel-estadistica">
        <span className="panel-estadistica-label">Mis Alumnos</span>
        <span className="panel-estadistica-numero">{totalAlumnos ?? "—"}</span>
      </div>

      <div className="panel-estadistica">
        <span className="panel-estadistica-label">Estado</span>
        <span className="panel-estadistica-valor">
          {profesor?.estado ? " Activo" : "Inactivo"}
        </span>
      </div>

      <div className="panel-estadistica">
        <span className="panel-estadistica-label">Miembro desde</span>
        <span className="panel-estadistica-valor">
          {profesor?.fechaRegistro ?? "—"}
        </span> 
      </div>
    </aside>
  );
}

function TablaAlumnos({ alumnos, cargando }) {
  const [filtro, setFiltro] = useState("");

  const alumnosFiltrados = alumnos.filter((a) =>
    `${a.nombre} ${a.apellido} ${a.username}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="tabla-bloque">
      <div className="tabla-cabecera">
        <h2 className="tabla-titulo">Mis Alumnos</h2>
        <input
          className="buscador-input"
          type="text"
          placeholder="Buscar alumno…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>F. Nacimiento</th>
              <th>F. Registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={7} className="celda-info">Cargando alumnos…</td>
              </tr>
            ) : alumnosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="celda-info">No se encontraron alumnos.</td>
              </tr>
            ) : (
              alumnosFiltrados.map((a) => (
                <tr key={a.idUsuario} className="tabla-fila">
                  <td>{a.nombre}</td>
                  <td>{a.apellido}</td>
                  <td>{a.username}</td>
                  <td>{a.direccion ?? "—"}</td>
                  <td>{a.fechaNacimiento ?? "—"}</td>
                  <td>{a.fechaRegistro ?? "—"}</td>
                  <td>
                    <span className={`badge-estado ${a.estado ? "activo" : "inactivo"}`}>
                      {a.estado ? "Activo" : "Inactivo"}
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

function DashboardProfesor() {
  const emailProfesor = localStorage.getItem("username") ?? "profesor@autoescuela.com";

  const [profesor, setProfesor] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);

  const cargarProfesor = async () => {
    try {
      const res = await fetch(`http://localhost:9002/usuarios/username/${emailProfesor}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfesor(data);
    } catch {
      console.error("No se pudo cargar el perfil del profesor.");
    }
  };

  const cargarAlumnos = async () => {
    setCargandoAlumnos(true);
    try {
      const res = await fetch(`http://localhost:9002/usuarios/rol/4`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAlumnos(data);
    } catch {
      console.error("No se pudo cargar la lista de alumnos.");
    } finally {
      setCargandoAlumnos(false);
    }
  };

  useEffect(() => {
    cargarProfesor();
    cargarAlumnos();
  }, []);

  return (
    <div className="dashboard-contenedor">
      <NavAzul />

      <div className="dashboard-bienvenida">
        <h1 className="bienvenida-texto">
          Bienvenido,{" "}
          <span className="bienvenida-nombre">
            {profesor ? profesor.nombre : "Profesor"}
          </span>{" "}
          al Dashboard
        </h1>
      </div>

      <div className="dashboard-contenido">
        <div className="dashboard-tabla-zona">
          <TablaAlumnos alumnos={alumnos} cargando={cargandoAlumnos} />
        </div>
        <PanelLateral profesor={profesor} totalAlumnos={alumnos.length || null} />
      </div>
    </div>
  );
}

export default DashboardProfesor;