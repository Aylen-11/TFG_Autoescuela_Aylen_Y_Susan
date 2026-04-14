import { useState, useEffect } from "react";

import { obtenerAuthHeaders } from "../utils/auth";
import { ModalConfirmarBorrado } from "./SharedUI";
import { ModalCambiarRol, ModalEditarUsuario, ModalAnadirUsuario, ModalVerInfo } from "./Modales";

/* ── Resalta el texto que coincide con la consulta ── */
function resaltarTexto(texto, consulta) {
  if (!consulta || !texto) return texto;
  const escaped = consulta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const partes = String(texto).split(regex);
  return partes.map((parte, i) =>
    regex.test(parte)
      ? <mark key={i} className="busqueda-resaltado">{parte}</mark>
      : parte
  );
}

function TablaCabecera({ titulo, onAnadir, labelBoton }) {
  return (
    <div className="tabla-cabecera">
      <h2 className="tabla-titulo">{titulo}</h2>
      <button className="topbar-btn-anadir" onClick={onAnadir}>
        + {labelBoton}
      </button>
    </div>
  );
}


const COLS = ["Username", "Nombre", "Apellido", "DNI", "Fecha Registro", "Fecha Nacimiento", "Dirección", "Teléfono", "Acciones"];

/* 
  tabla administradoores
*/
export function TablaAdministradores({ mostrarAlerta, consulta = "" }) {
  const [admins, setAdmins] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/1", { method: "GET", headers });
      if (res.ok) setAdmins(await res.json());
    } catch (e) { console.log("Error en fetch admins", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarRol = async (usuario, nuevoRol) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/rol/modificar/${usuario.username}/${nuevoRol}`, { method: "PUT", headers });
      if (res.ok) mostrarAlerta("¡Rol editado correctamente!", "exito");
      else mostrarAlerta("Error al cambiar el rol.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalRol(false);
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, { method: "DELETE", headers });
      if (res.ok) mostrarAlerta("Administrador eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el administrador.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalBorrado(false);
    cargar();
  };

  const guardarNuevo = async (datos) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/usuarios/alta", { method: "POST", headers, body: JSON.stringify(datos) });
      if (res.ok) mostrarAlerta("¡Administrador creado correctamente!", "exito");
      else mostrarAlerta((await res.text()) || "Error al crear.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalAnadir(false);
    cargar();
  };

  const consultaNorm = consulta.trim().toLowerCase();
  const adminsFiltrados = consultaNorm
    ? admins.filter(a => `${a.nombre} ${a.apellidos}`.toLowerCase().includes(consultaNorm))
    : admins;

  return (
    <>
      <div className="tabla-bloque">
        <TablaCabecera titulo="Administradores" onAnadir={() => setModalAnadir(true)} labelBoton="Añadir Administrador" />
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {adminsFiltrados.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">
                  {consultaNorm ? "No se encontraron resultados." : "Sin datos — comprueba la conexión con el backend."}
                </td></tr>
              ) : (
                adminsFiltrados.map((a, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{a.username}</td>
                    <td>{resaltarTexto(a.nombre, consulta)}</td>
                    <td>{resaltarTexto(a.apellidos, consulta)}</td>
                    <td>{a.dni}</td><td>{a.fechaRegistro}</td><td>{a.fechaNacimiento}</td>
                    <td>{a.direccion}</td><td>{a.telefono}</td>
                    <td className="acciones-celda">
                      <button className="boton-editar" onClick={() => { setUsuarioSeleccionado(a); setModalRol(true); }}>Editar</button>
                      <button className="boton-eliminar" onClick={() => { setUsuarioSeleccionado(a); setModalBorrado(true); }}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalCambiarRol visible={modalRol} usuario={usuarioSeleccionado} onGuardar={guardarRol} onCerrar={() => setModalRol(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="administrador" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
      <ModalAnadirUsuario visible={modalAnadir} rolPorDefecto="1" onGuardar={guardarNuevo} onCerrar={() => setModalAnadir(false)} />
    </>
  );
}

/**tabla de profesores */
export function TablaProfesores({ mostrarAlerta, consulta = "" }) {
  const [profes, setProfes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [alumnosAsignados, setAlumnosAsignados] = useState({});

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/2", { method: "GET", headers });
      if (res.ok) setProfes(await res.json());
    } catch (e) { console.log("Error en fetch profes", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarRol = async (usuario, nuevoRol) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/rol/modificar/${usuario.username}/${nuevoRol}`, { method: "PUT", headers });
      if (res.ok) mostrarAlerta("¡Rol editado correctamente!", "exito");
      else mostrarAlerta("Error al cambiar el rol.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalRol(false);
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, { method: "DELETE", headers });
      if (res.ok) mostrarAlerta("Profesor eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el profesor.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalBorrado(false);
    cargar();
  };

  const guardarNuevo = async (datos) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/usuarios/alta", { method: "POST", headers, body: JSON.stringify(datos) });
      if (res.ok) mostrarAlerta("¡Profesor creado correctamente!", "exito");
      else mostrarAlerta((await res.text()) || "Error al crear.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalAnadir(false);
    cargar();
  };

  const cargarAlumnosAsignadosProfe = async (usernameProfe) => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch(`http://localhost:9002/matricula/profe/${usernameProfe}`, { method: "GET", headers });
      if (res.ok) {
        const data = await res.json();
        setAlumnosAsignados((prev) => ({ ...prev, [usernameProfe]: data }));
      }
    } catch (e) { console.log("Error en fetch alumnos asignados", e); }
  };

  useEffect(() => {
    if (profes.length > 0) profes.forEach((p) => cargarAlumnosAsignadosProfe(p.username));
  }, [profes]);

  const consultaNorm = consulta.trim().toLowerCase();
  const profesFiltrados = consultaNorm
    ? profes.filter(p => `${p.nombre} ${p.apellidos}`.toLowerCase().includes(consultaNorm))
    : profes;

  return (
    <>
      <div className="tabla-bloque">
        <TablaCabecera titulo="Profesores" onAnadir={() => setModalAnadir(true)} labelBoton="Añadir Profesor" />
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {profesFiltrados.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">
                  {consultaNorm ? "No se encontraron resultados." : "Sin datos — comprueba la conexión con el backend."}
                </td></tr>
              ) : (
                profesFiltrados.map((p, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{p.username}</td>
                    <td>{resaltarTexto(p.nombre, consulta)}</td>
                    <td>{resaltarTexto(p.apellidos, consulta)}</td>
                    <td>{p.dni}</td><td>{p.fechaRegistro}</td><td>{p.fechaNacimiento}</td>
                    <td>{p.direccion}</td><td>{p.telefono}</td>
                    <td className="acciones-celda">
                      <button className="boton-editar" onClick={() => { setUsuarioSeleccionado(p); setModalRol(true); }}>Editar</button>
                      <button className="boton-eliminar" onClick={() => { setUsuarioSeleccionado(p); setModalBorrado(true); }}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="subtabla-bloque">
          <h3 className="subtabla-titulo">Alumnos por Profesor</h3>
          <div className="tabla-scroll">
            <table className="tabla subtabla">
              <thead><tr><th>Profesor (email)</th><th>Alumno</th></tr></thead>
              <tbody>
                {profesFiltrados.length === 0 ? (
                  <tr><td colSpan={2} className="tabla-vacia">Sin datos</td></tr>
                ) : (
                  profesFiltrados.map((p, i) => (
                    <tr key={i} className="tabla-fila">
                      <td>{p.username}</td>
                      <td>
                        {alumnosAsignados[p.username]?.length > 0
                          ? alumnosAsignados[p.username].join(", ")
                          : "Sin alumnos asignados"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalCambiarRol visible={modalRol} usuario={usuarioSeleccionado} onGuardar={guardarRol} onCerrar={() => setModalRol(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="profesor" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
      <ModalAnadirUsuario visible={modalAnadir} rolPorDefecto="2" onGuardar={guardarNuevo} onCerrar={() => setModalAnadir(false)} />
    </>
  );
}

/*tabla de alumnos */
export function TablaAlumnos({ mostrarAlerta, consulta = "" }) {
  const [alumnos, setAlumnos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/3", { method: "GET", headers });
      if (res.ok) setAlumnos(await res.json());
    } catch (e) { console.log("Error en fetch alumnos", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarEdicion = async (datos) => {
    const headers = obtenerAuthHeaders();
    if (datos.campo === "rol") {
      try {
        const res = await fetch(`http://localhost:9002/rol/modificar/${datos.username}/${datos.valor}`, { method: "PUT", headers });
        if (res.ok) mostrarAlerta("¡Rol actualizado!", "exito");
        else mostrarAlerta("Error al cambiar el rol.", "error");
      } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
      cargar(); return;
    }
    const bodyCompleto = {
      username: datos.username, dni: datos.dni, nombre: datos.nombre,
      apellidos: datos.apellidos, fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono, direccion: datos.direccion, [datos.campo]: datos.valor,
    };
    try {
      const res = await fetch(`http://localhost:9002/usuarios/modificar/${datos.username}`, { method: "PUT", headers, body: JSON.stringify(bodyCompleto) });
      const mensajes = { dni: "DNI actualizado.", direccion: "Dirección actualizada." };
      if (res.ok) mostrarAlerta(mensajes[datos.campo], "exito");
      else mostrarAlerta("Error al guardar el cambio.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, { method: "DELETE", headers });
      if (res.ok) mostrarAlerta("Alumno eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el alumno.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalBorrado(false);
    cargar();
  };

  const guardarNuevo = async (datos) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/usuarios/alta", { method: "POST", headers, body: JSON.stringify(datos) });
      if (res.ok) mostrarAlerta("¡Alumno creado correctamente!", "exito");
      else mostrarAlerta((await res.text()) || "Error al crear.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalAnadir(false);
    cargar();
  };

  const consultaNorm = consulta.trim().toLowerCase();
  const alumnosFiltrados = consultaNorm
    ? alumnos.filter(a => `${a.nombre} ${a.apellidos}`.toLowerCase().includes(consultaNorm))
    : alumnos;

  return (
    <>
      <div className="tabla-bloque">
        <TablaCabecera titulo="Alumnos" onAnadir={() => setModalAnadir(true)} labelBoton="Añadir Alumno" />
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {alumnosFiltrados.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">
                  {consultaNorm ? "No se encontraron resultados." : "Sin datos — comprueba la conexión con el backend."}
                </td></tr>
              ) : (
                alumnosFiltrados.map((a, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{a.username}</td>
                    <td>{resaltarTexto(a.nombre, consulta)}</td>
                    <td>{resaltarTexto(a.apellidos, consulta)}</td>
                    <td>{a.dni}</td><td>{a.fechaRegistro}</td><td>{a.fechaNacimiento}</td>
                    <td>{a.direccion}</td><td>{a.telefono}</td>
                    <td className="acciones-celda">
                      <button className="boton-ver" onClick={() => { setUsuarioSeleccionado(a); setModalVer(true); }}>Ver</button>
                      <button className="boton-editar" onClick={() => { setUsuarioSeleccionado(a); setModalEditar(true); }}>Editar</button>
                      <button className="boton-eliminar" onClick={() => { setUsuarioSeleccionado(a); setModalBorrado(true); }}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalEditarUsuario visible={modalEditar} usuario={usuarioSeleccionado} tipo="alumno" onGuardar={guardarEdicion} onCerrar={() => setModalEditar(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="alumno" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
      <ModalVerInfo visible={modalVer} usuario={usuarioSeleccionado} onCerrar={() => { setModalVer(false); setUsuarioSeleccionado(null); }} mostrarAlerta={mostrarAlerta}/>
      <ModalAnadirUsuario visible={modalAnadir} rolPorDefecto="3" onGuardar={guardarNuevo} onCerrar={() => setModalAnadir(false)} />
    </>
  );
}
/*tabla de clientes */
export function TablaClientes({ mostrarAlerta, consulta = "" }) {
  const [clientes, setClientes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/4", { method: "GET", headers });
      if (res.ok) setClientes(await res.json());
    } catch (e) { console.log("Error en fetch clientes", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarEdicion = async (datos) => {
    const headers = obtenerAuthHeaders();
    if (datos.campo === "rol") {
      try {
        const res = await fetch(`http://localhost:9002/rol/modificar/${datos.username}/${datos.valor}`, { method: "PUT", headers });
        if (res.ok) mostrarAlerta("¡Rol actualizado!", "exito");
        else mostrarAlerta("Error al cambiar el rol.", "error");
      } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
      cargar(); return;
    }
    const bodyCompleto = {
      username: datos.username, dni: datos.dni, nombre: datos.nombre,
      apellidos: datos.apellidos, fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono, direccion: datos.direccion, [datos.campo]: datos.valor,
    };
    try {
      const res = await fetch(`http://localhost:9002/usuarios/modificar/${datos.username}`, { method: "PUT", headers, body: JSON.stringify(bodyCompleto) });
      const mensajes = { dni: "DNI actualizado.", direccion: "Dirección actualizada." };
      if (res.ok) mostrarAlerta(mensajes[datos.campo], "exito");
      else mostrarAlerta("Error al guardar el cambio.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, { method: "DELETE", headers });
      if (res.ok) mostrarAlerta("Cliente eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el cliente.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalBorrado(false);
    cargar();
  };

  const guardarNuevo = async (datos) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/usuarios/alta", { method: "POST", headers, body: JSON.stringify(datos) });
      if (res.ok) mostrarAlerta("¡Cliente creado correctamente!", "exito");
      else mostrarAlerta((await res.text()) || "Error al crear.", "error");
    } catch (e) { mostrarAlerta("Error de conexión.", "error"); }
    setModalAnadir(false);
    cargar();
  };

  const consultaNorm = consulta.trim().toLowerCase();
  const clientesFiltrados = consultaNorm
    ? clientes.filter(c => `${c.nombre} ${c.apellidos}`.toLowerCase().includes(consultaNorm))
    : clientes;

  return (
    <>
      <div className="tabla-bloque">
        <TablaCabecera titulo="Clientes" onAnadir={() => setModalAnadir(true)} labelBoton="Añadir Cliente" />
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">
                  {consultaNorm ? "No se encontraron resultados." : "Sin datos — comprueba la conexión con el backend."}
                </td></tr>
              ) : (
                clientesFiltrados.map((c, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{c.username}</td>
                    <td>{resaltarTexto(c.nombre, consulta)}</td>
                    <td>{resaltarTexto(c.apellidos, consulta)}</td>
                    <td>{c.dni}</td><td>{c.fechaRegistro}</td><td>{c.fechaNacimiento}</td>
                    <td>{c.direccion}</td><td>{c.telefono}</td>
                    <td className="acciones-celda">
                      <button className="boton-ver" onClick={() => { setUsuarioSeleccionado(c); setModalVer(true); }}>Ver</button>
                      <button className="boton-editar" onClick={() => { setUsuarioSeleccionado(c); setModalEditar(true); }}>Editar</button>
                      <button className="boton-eliminar" onClick={() => { setUsuarioSeleccionado(c); setModalBorrado(true); }}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalEditarUsuario visible={modalEditar} usuario={usuarioSeleccionado} tipo="cliente" onGuardar={guardarEdicion} onCerrar={() => setModalEditar(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="cliente" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
      <ModalVerInfo visible={modalVer} usuario={usuarioSeleccionado} onCerrar={() => { setModalVer(false); setUsuarioSeleccionado(null); }} mostrarAlerta={mostrarAlerta} />
      <ModalAnadirUsuario visible={modalAnadir} rolPorDefecto="4" onGuardar={guardarNuevo} onCerrar={() => setModalAnadir(false)} />
    </>
  );
} 