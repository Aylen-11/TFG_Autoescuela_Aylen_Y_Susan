import { useState, useEffect } from "react";
import "./DashboardAdmin.css";
import { obtenerUsername, obtenerAuthHeaders } from "../utils/auth";
import { NavLateral, TopbarPerfil } from "../Components/NavLateral";
import { AlertaFlotante } from "../Components/SharedUI";
import { BarraBusqueda } from "../Components/BarraBusqueda";
import { TarjetasEstadisticas } from "../Components/TarjetasEstadisticas";
import { TablaAdministradores, TablaProfesores, TablaAlumnos, TablaClientes } from "../Components/Tablas";

export function FilaUsuario({ usuario, mostrarVerInfo = false }) {
  return (
    <tr className="tabla-fila">
      <td>{usuario.username}</td>
      <td>{usuario.nombre}</td>
      <td>{usuario.apellido}</td>
      <td>{usuario.fechaRegistro}</td>
      <td>{usuario.fechaNacimiento}</td>
      <td>{usuario.direccion}</td>
      <td>{usuario.idPerfil}</td>
      <td><span className="etiqueta-rol">{usuario.rol}</span></td>
      <td className="acciones-celda">
        {mostrarVerInfo && <button className="boton-ver">Ver Info</button>}
        <button className="boton-editar">Editar</button>
        <button className="boton-eliminar">Eliminar</button>
      </td>
    </tr>
  );
}

export function FilaMatricula({ matricula }) {
  return (
    <tr className="tabla-fila">
      <td>{matricula.numero}</td>
      <td>{matricula.correoAlumno}</td>
      <td>{matricula.fechaRegistro}</td>
      <td>{matricula.tipoCarnet}</td>
      <td>{matricula.tipoPaquete}</td>
      <td className="acciones-celda">
        <button className="boton-editar">Modificar</button>
        <button className="boton-eliminar">Eliminar</button>
      </td>
    </tr>
  );
}

function DashboardAdmin() {
  const username = obtenerUsername();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [rolActivo, setRolActivo] = useState("administradores");
  const [totalPorRol, setTotalPorRol] = useState({
    administradores: null,
    profesores: null,
    alumnos: null,
    clientes: null,
  });
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "exito" });
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [consultaBusqueda, setConsultaBusqueda] = useState("");


  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:9002/usuarios/nombre/${username}`, { method: "GET" });
        if (res.ok) setNombreUsuario(await res.text());
      } catch (e) {
        console.log("Error en fetch Nombre", e);
      }
      setCorreoUsuario(username);
    };
    obtenerDatosUsuario();
  }, []);

  useEffect(() => {
    const cargarTotales = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      const ids = { administradores: 1, profesores: 2, alumnos: 3, clientes: 4 };
      const nuevos = {};
      const todosAcumulados = [];
      for (const [rol, id] of Object.entries(ids)) {
        try {
          const res = await fetch(`http://localhost:9002/usuarios/todosdto/${id}`, { method: "GET", headers });
          if (res.ok) {
            const datos = await res.json();
            nuevos[rol] = datos.length;
            todosAcumulados.push(...datos.map((u) => ({ ...u, idRol: id })));
          } else {
            nuevos[rol] = null;
          }
        } catch {
          nuevos[rol] = null;
        }
      }
      setTotalPorRol(nuevos);
      setTodosUsuarios(todosAcumulados);
    };
    cargarTotales();
  }, [rolActivo]);

  const mostrarAlerta = (mensaje, tipo = "exito") => {
    setAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => setAlerta((a) => ({ ...a, visible: false })), 3000);
  };

  const renderTabla = () => {
    switch (rolActivo) {
      case "administradores":
        return <TablaAdministradores mostrarAlerta={mostrarAlerta} consulta={consultaBusqueda} />;
      case "profesores":
        return <TablaProfesores mostrarAlerta={mostrarAlerta} consulta={consultaBusqueda} />;
      case "alumnos":
        return <TablaAlumnos mostrarAlerta={mostrarAlerta} consulta={consultaBusqueda} />;
      case "clientes":
        return <TablaClientes mostrarAlerta={mostrarAlerta} consulta={consultaBusqueda} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-contenedor">
      <NavLateral
        rolActivo={rolActivo}
        setRolActivo={setRolActivo}
        totalPorRol={totalPorRol}
      />

      <main className="dashboard-main">
        <AlertaFlotante mensaje={alerta.mensaje} tipo={alerta.tipo} visible={alerta.visible} />

        <div className="dashboard-topbar">

          {/* el bienvenidos + la fecha del dia*/}
          <div className="dashboard-topbar-saludo">
            <h1 className="topbar-saludo-texto">
              Bienvenido, <span className="topbar-saludo-nombre">{nombreUsuario || username}</span>
            </h1>
            <p className="topbar-saludo-sub">{fechaHoy}</p>
          </div>

          <div className="topbar-acciones">
            <BarraBusqueda onConsultaCambio={setConsultaBusqueda} />
            <TopbarPerfil
              nombreUsuario={nombreUsuario || username}
              correoUsuario={correoUsuario}
              rolEtiqueta="Administrador"
              imagenPerfil={imagenPerfil}
              onImagenCambio={setImagenPerfil}
            />
          </div>
        </div>

        <div className="dashboard-cuerpo">
          <TarjetasEstadisticas
            totalPorRol={totalPorRol}
            rolActivo={rolActivo}
            setRolActivo={setRolActivo}
          />
          <div className="dashboard-tabla-zona">{renderTabla()}</div>
        </div>
      </main>
    </div>
  );
}

export default DashboardAdmin;