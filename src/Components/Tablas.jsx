import { useState, useEffect } from "react";

import { obtenerAuthHeaders } from "../utils/auth";
import { ModalConfirmarBorrado } from "./SharedUI";
import { ModalCambiarRol, ModalEditarUsuario, ModalAnadirUsuario, ModalVerInfo } from "./Modales";

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

function BarraBusquedaTabla({ consulta, onChange, placeholder = "Buscar por nombre y apellido" }) {
  return (
    <div className="barra-busqueda-wrapper">
      <div className="barra-busqueda-input-zona">
        <div className="barra-busqueda-icono-wrapper">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="barra-busqueda-svg">
            <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5
             0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0
              0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45
               3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 
               3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 
               9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
          </svg>
        </div>
        <input
          className="barra-busqueda-input"
          type="text"
          placeholder={placeholder}
          value={consulta}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function generarPdfUsuario(usuario, matricula) {
  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const nombreCompleto = `${usuario.nombre || ""} ${usuario.apellidos || ""}`.trim();

  let bloqueMatricula = "";
  if (matricula && matricula.length > 0) {
    bloqueMatricula = matricula.map((m, idx) => `
      <div class="matricula-bloque">
        ${matricula.length > 1 ? `<h3>Matrícula ${idx + 1}</h3>` : ""}
        <table>
          <tr><td class="campo">Tipo de carnet</td><td>${m.tiposCarnet || "—"}</td></tr>
          <tr><td class="campo">Tipo de paquete</td><td>${m.tipoPaquete || "—"}</td></tr>
          <tr><td class="campo">Profesor asignado</td><td>${m.nombreProfesor ? `${m.nombreProfesor} ${m.apellidosProfesor || ""}` : "—"}</td></tr>
          <tr><td class="campo">Fecha examen teórico</td><td>${m.fechaTeorico || "—"}</td></tr>
          <tr><td class="campo">Fecha examen práctico</td><td>${m.fechaPractico || "—"}</td></tr>
          <tr><td class="campo">Psicotécnico</td><td>${m.psicotecnico ? "✔ Realizado" : "✘ Pendiente"}</td></tr>
          <tr><td class="campo">Pago completo</td><td>${m.pago ? "✔ Pagado" : "✘ Pendiente"}</td></tr>
          <tr><td class="campo">Tasa DGT</td><td>${m.tasaDgt ? "✔ Pagada" : "✘ Pendiente"}</td></tr>
          ${m.idVehiculo ? `<tr><td class="campo">Vehículo asignado</td><td>${m.idVehiculo} — ${m.tipoVehiculo || ""}</td></tr>` : ""}
        </table>
      </div>
    `).join("");
  } else {
    bloqueMatricula = `<p class="sin-matricula">Este alumno no tiene ninguna matrícula registrada en el sistema.</p>`;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Comunicado — ${nombreCompleto}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; background: #fff; color: #1a1a1a; padding: 40px 50px; font-size: 14px; line-height: 1.6; }
  .cabecera { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #012a5e; padding-bottom: 20px; margin-bottom: 28px; }
  .logo-zona h1 { font-size: 22px; font-weight: 900; color: #012a5e; letter-spacing: 2px; }
  .logo-zona p { font-size: 12px; color: #555; margin-top: 4px; }
  .fecha-zona { text-align: right; font-size: 13px; color: #555; }
  .saludo { font-size: 15px; margin-bottom: 18px; }
  .saludo strong { color: #012a5e; }
  .intro { margin-bottom: 22px; font-size: 14px; color: #333; }
  .datos-personales { background: #f0f5ff; border-left: 4px solid #012a5e; padding: 14px 18px; border-radius: 6px; margin-bottom: 22px; }
  .datos-personales h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #012a5e; margin-bottom: 10px; }
  .datos-personales table { width: 100%; border-collapse: collapse; }
  .datos-personales td { padding: 4px 8px; font-size: 13px; }
  .datos-personales td.campo { font-weight: 700; color: #012a5e; width: 40%; }
  .matriculas-titulo { font-size: 15px; font-weight: 900; color: #012a5e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; border-bottom: 1px solid #cdd8ef; padding-bottom: 8px; }
  .matricula-bloque { background: #f8faff; border: 1px solid #dce8f8; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; }
  .matricula-bloque h3 { font-size: 13px; color: #014495; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }
  .matricula-bloque table { width: 100%; border-collapse: collapse; }
  .matricula-bloque td { padding: 5px 8px; font-size: 13px; border-bottom: 1px solid #eef3fb; }
  .matricula-bloque td.campo { font-weight: 700; color: #012a5e; width: 40%; }
  .sin-matricula { color: #888; font-style: italic; padding: 20px; text-align: center; }
  .pie { margin-top: 40px; border-top: 1px solid #cdd8ef; padding-top: 18px; font-size: 12px; color: #777; text-align: center; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="cabecera">
    <div class="logo-zona">
      <h1>AUTOESCUELA VILLAREY</h1>
      <p>Gestión y formación de conductores</p>
    </div>
    <div class="fecha-zona">
      <p>${fechaHoy}</p>
      <p>Documento interno</p>
    </div>
  </div>
  <p class="saludo">Estimado/a <strong>${nombreCompleto}</strong>,</p>
  <p class="intro">
    Le presentamos a continuación un resumen detallado de su expediente en nuestra autoescuela.
    Por favor, revise los datos y contacte con nosotros si detecta alguna incidencia.
  </p>
  <div class="datos-personales">
    <h2>Datos personales</h2>
    <table>
      <tr><td class="campo">Usuario / Email</td><td>${usuario.username || "—"}</td></tr>
      <tr><td class="campo">DNI</td><td>${usuario.dni || "—"}</td></tr>
      <tr><td class="campo">Fecha de nacimiento</td><td>${usuario.fechaNacimiento || "—"}</td></tr>
      <tr><td class="campo">Dirección</td><td>${usuario.direccion || "—"}</td></tr>
      <tr><td class="campo">Teléfono</td><td>${usuario.telefono || "—"}</td></tr>
      <tr><td class="campo">Fecha de registro</td><td>${usuario.fechaRegistro || "—"}</td></tr>
    </table>
  </div>
  <p class="matriculas-titulo">Información de matrícula</p>
  ${bloqueMatricula}
  <div class="pie">
    Autoescuela Villarey · Documento generado automáticamente el ${fechaHoy} · Confidencial
  </div>
</body>
</html>`;

  const ventana = window.open("", "_blank", "width=800,height=900");
  if (ventana) {
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
  }
}

function TablaCabecera({ titulo, onAnadir, labelBoton, consulta, onConsultaCambio, mostrarPdf = false, onPdf }) {
  return (
    <div className="tabla-cabecera">
      <div className="tabla-cabecera-top">
        <h2 className="tabla-titulo">{titulo}</h2>
        <button className="topbar-btn-anadir" onClick={onAnadir}>
          + {labelBoton}
        </button>
      </div>
      <div className="tabla-cabecera-buscador">
        <BarraBusquedaTabla consulta={consulta} onChange={onConsultaCambio} />
        {mostrarPdf && (
          <button
            className="boton-exportar-pdf"
            onClick={onPdf}
            title="Exportar ficha del usuario buscado"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style={{ marginRight: 6, verticalAlign: "middle" }}>
              <path d="M4 18h12a1 1 0 0 0 1-1V7l-5-5H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zm8-14.5L14.5 6H12V3.5zM6 9h8v1H6V9zm0 3h8v1H6v-1zm0 3h5v1H6v-1z"/>
            </svg>
            Exportar PDF
          </button>
        )}
      </div>
    </div>
  );
}

const COLS = ["Username", "Nombre", "Apellido", "DNI", "Fecha Registro", "Fecha Nacimiento", "Dirección", "Teléfono", "Acciones"];

export function TablaAdministradores({ mostrarAlerta }) {
  const [admins, setAdmins] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [consulta, setConsulta] = useState("");

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
        <TablaCabecera
          titulo="Administradores"
          onAnadir={() => setModalAnadir(true)}
          labelBoton="Añadir Administrador"
          consulta={consulta}
          onConsultaCambio={setConsulta}
        />
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

export function TablaProfesores({ mostrarAlerta }) {
  const [profes, setProfes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [alumnosAsignados, setAlumnosAsignados] = useState({});
  const [consulta, setConsulta] = useState("");

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
        <TablaCabecera
          titulo="Profesores"
          onAnadir={() => setModalAnadir(true)}
          labelBoton="Añadir Profesor"
          consulta={consulta}
          onConsultaCambio={setConsulta}
        />
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

export function TablaAlumnos({ mostrarAlerta }) {
  const [alumnos, setAlumnos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [consulta, setConsulta] = useState("");

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
        <TablaCabecera
          titulo="Alumnos"
          onAnadir={() => setModalAnadir(true)}
          labelBoton="Añadir Alumno"
          consulta={consulta}
          onConsultaCambio={setConsulta}
          mostrarPdf={false}
        />
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
      <ModalVerInfo visible={modalVer} usuario={usuarioSeleccionado} onCerrar={() => { setModalVer(false); setUsuarioSeleccionado(null); }} mostrarAlerta={mostrarAlerta} />
      <ModalAnadirUsuario visible={modalAnadir} rolPorDefecto="3" onGuardar={guardarNuevo} onCerrar={() => setModalAnadir(false)} />
    </>
  );
}

export function TablaClientes({ mostrarAlerta }) {
  const [clientes, setClientes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [consulta, setConsulta] = useState("");

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
        <TablaCabecera
          titulo="Clientes"
          onAnadir={() => setModalAnadir(true)}
          labelBoton="Añadir Cliente"
          consulta={consulta}
          onConsultaCambio={setConsulta}
          mostrarPdf={false}
        />
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