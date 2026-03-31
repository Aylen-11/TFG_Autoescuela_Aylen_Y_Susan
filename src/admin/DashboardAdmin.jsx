import { Link } from "react-router-dom";
import "./DashboardAdmin.css";
import { useState, useEffect, use } from "react";


//------------------------------------------------------------------------------------------------------------------------------------------------------
//nos traemos las creedenciales del login protegidas, las utilizamos para poner las autorizaciones para las apis
function obtenerUsername() {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  const decoded = atob(auth);
  const [user] = decoded.split(":");
  return user;
}

function obtenerAuthHeaders() {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  return {
    "Authorization": "Basic " + auth,
    "Content-Type": "application/json"
  };
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//NAV
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
      <Link to="/" className="nav-dashboard-cerrar">Cerrar Sesión</Link>
    </nav>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//Alertas
function AlertaFlotante({ mensaje, tipo, visible }) {
  if (!visible) return null;
  return (
    <div className={`alerta-flotante alerta-flotante--${tipo}`}>
      {mensaje}
    </div>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODALES 
function Modal({ visible, onCerrar, titulo, children }) {
  if (!visible) return null;
  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-contenido">{children}</div>
      </div>
    </div>
  );
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA CONFIRMAR EL BORRADO
function ModalConfirmarBorrado({ visible, tipo, onConfirmar, onCancelar }) {
  return (
    <Modal visible={visible} onCerrar={onCancelar} titulo="Confirmar eliminación">
      <div className="confirmar-cuerpo">
        <div className="confirmar-icono-svg">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L1 21h22L12 2z" fill="#ffffff" stroke="#003289" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="14" stroke="#004475" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17.5" r="1.2" fill="#002453" />
          </svg>
        </div>
        <p className="confirmar-texto">¿Seguro que quieres borrar este <strong>{tipo}</strong>?</p>
        <p className="confirmar-sub">Esta acción no se puede deshacer.</p>
        <div className="confirmar-botones">
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
          <button className="btn-confirmar-borrar" onClick={onConfirmar}>Sí, eliminar</button>
        </div>
      </div>
    </Modal>
  );
}

const ROLES = [
  { num: "1", nombre: "Administrador" },
  { num: "2", nombre: "Profesor" },
  { num: "3", nombre: "Alumno" },
  { num: "4", nombre: "Cliente" },
];

function SelectorRolNumerico({ valor, onChange }) {
  return (
    <div className="roles-numero-grid">
      {ROLES.map(({ num, nombre }) => (
        <button
          key={num}
          type="button"
          className={`rol-numero-btn ${valor === num ? "rol-numero-btn--activo" : ""}`}
          onClick={() => onChange(num)}
        >
          <span className="rol-numero">{num}</span>
          <span className="rol-nombre">{nombre}</span>
        </button>
      ))}
    </div>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA CAMBIAR EL ROL DE UN USUARIO (ADMINISTRADORES Y PROFESORES)
function ModalCambiarRol({ visible, usuario, onGuardar, onCerrar }) {
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  useEffect(() => { setRolSeleccionado(""); }, [visible]);

  const guardar = () => {
    if (!rolSeleccionado) { alert("Selecciona un rol primero."); return; }
    onGuardar(usuario, rolSeleccionado);
  };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo="Editar rol">
      <div className="modal-rol-cuerpo">
        <p className="modal-rol-usuario">Usuario: <strong>{usuario?.username}</strong></p>
        <label className="campo-label">Cambiar rol a:</label>
        <SelectorRolNumerico valor={rolSeleccionado} onChange={setRolSeleccionado} />
        <button className="btn-cambiar-rol" onClick={guardar}>Cambiar</button>
      </div>
    </Modal>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA EDITAR DNI, DIRECCIÓN Y ROL DE UN ALUMNO (SOLO EN ALUMNOS, NO EN ADMINISTRADORES NI PROFESORES)
function ModalEditarUsuario({ visible, usuario, tipo, onGuardar, onCerrar }) {
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mostrarAvisoDni, setMostrarAvisoDni] = useState(false);

  useEffect(() => {
    if (usuario) {
      setDni(usuario.dni || "");
      setDireccion(usuario.direccion || "");
      setRolSeleccionado("");
      setMostrarAvisoDni(false);
    }
  }, [usuario, visible]);

  const guardarRol = () => {
    if (!rolSeleccionado) { alert("Selecciona un rol."); return; }
    onGuardar({ ...usuario, campo: "rol", valor: rolSeleccionado });
  };

  const guardarDni = () => {
    if (!mostrarAvisoDni) { setMostrarAvisoDni(true); return; }
    onGuardar({ ...usuario, campo: "dni", valor: dni });
    setMostrarAvisoDni(false);
  };

  const guardarDireccion = () => {
    onGuardar({ ...usuario, campo: "direccion", valor: direccion });
  };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo={`Modificar ${tipo}: ${usuario?.username}`}>
      <div className="modal-editar-cuerpo">
        <div className="editar-seccion">
          <h4 className="editar-seccion-titulo">Editar rol</h4>
          <SelectorRolNumerico valor={rolSeleccionado} onChange={setRolSeleccionado} />
          <button className="btn-cambiar-campo btn-cambiar-campo--full" onClick={guardarRol}>Cambiar rol</button>
        </div>
        <div className="editar-seccion">
          <h4 className="editar-seccion-titulo">Editar campos</h4>
          <div className="editar-fila">
            <label className="campo-label-inline">DNI:</label>
            <input className="campo-input" type="text" value={dni}
              onChange={(e) => { setDni(e.target.value); setMostrarAvisoDni(false); }}
              placeholder="Nuevo DNI"
            />
            <button
              className={`btn-cambiar-campo ${mostrarAvisoDni ? "btn-confirmar-aviso" : ""}`}
              onClick={guardarDni}
            >
              {mostrarAvisoDni ? "Confirmar" : "Cambiar"}
            </button>
          </div>
          {mostrarAvisoDni && (
            <div className="aviso-legal">
              <span className="aviso-icono">⚠</span>
              <div>
                <p><strong>Warning:</strong> Los datos deben coincidir con los de la persona real.
                  En caso de falsificación será penalizado de manera jurídica.{" "}
                  <em>Ley Orgánica 10/1995, arts. 390-394.</em>
                </p>
                <p className="aviso-confirmar">Pulsa <strong>Confirmar</strong> para guardar el cambio de DNI.</p>
              </div>
            </div>
          )}
          <div className="editar-fila editar-fila--mt">
            <label className="campo-label-inline">Dirección:</label>
            <input className="campo-input" type="text" value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Nueva dirección"
            />
            <button className="btn-cambiar-campo" onClick={guardarDireccion}>Cambiar</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* añadir matricula WIP
//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA AÑADIR UN NUEVA MATRICULA(ALUMNO Y CLIENTE)
function ModalAnadirMatricula({ visible, onGuardar, onCerrar, usuario }) {
  const [form, setForm] = useState({
    psicotecnico: "",
    pago: "",
    tasaDgt: "",
    usernameAlumno: "",
    usernameProfesor: "",
    tiposCarnet: "",
    idVehiculo: "",
    tipoPaquete: "",
    fechaTeorico: "",
    fechaPractico: ""
  });

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = () => {
    if (!form) {
      alert("Rellena todos los campos.");
      return;
    }

    onGuardar(form);
  };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo={`Añadir matrícula para ${usuario?.username}`}>
      <div className="modal-anadir-cuerpo">
        <div className="anadir-grid">
          {[
            { campo: "Psicotecnico", label: "¿Tiene el psicotecnico?", tipo: "boolean" },
            { campo: "pago", label: "¿Tiene todo pagado ya?", tipo: "boolean" },
            { campo: "tasaDgt", label: "¿Tiene pagada la tasa de la DGT?", tipo: "boolean" },
            { campo: "Alumno", label: "Alumno asignado", tipo: "text" },
            { campo: "Profesor", label: "Profesor asignado", tipo: "text" },
            { campo: "Carnet", label: "Tipo de carnet", tipo: "text" },
            { campo: "Vehiculo", label: "Numero de vehiculo asignado", tipo: "text" },
            { campo: "Paquete", label: "Tipo de paquete", tipo: "text" },
            { campo: "Fecha examen teorico", label: "Fecha", tipo: "date" },
            { campo: "Fecha examen practico", label: "Fecha", tipo: "date" },
          ].map(({ campo, label, tipo }) => (
            <div key={campo} className="anadir-campo">
              <label className="campo-label">{label}</label>
              {tipo === "boolean" ? (
                <button
                  type="button"
                  className={`info-badge ${form[campo] ? "badge-si" : "badge-no"}`}
                  onClick={() => cambiar(campo, !form[campo])}
                >
                  {form[campo] ? "Sí" : "No"}
                </button>
              ) : (
                <input
                  className="campo-input"
                  type={tipo}
                  value={form[campo]}
                  onChange={(e) => cambiar(campo, e.target.value)}
                  placeholder={label}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <button className="btn-guardar-usuario" onClick={guardar}>Crear</button>
    </Modal>
  );
}*/


//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA VER INFORMACIÓN COMPLETA DE UN USUARIO (SOLO EN ALUMNOS Y CLIENTES)
function ModalVerInfo({ visible, usuario, onCerrar }) {
  if (!visible || !usuario) return null;
  // const m = usuario.matricula || null;

  const [matricula, setMatricula] = useState([]);

  const cargarMatriculaAlumno = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch(`http://localhost:9002/matricula/info/${usuario.username}`, { method: "GET", headers });
      if (res.ok) setMatricula(await res.json());
      else console.log("Error al obtener administradores");
    } catch (e) { console.log("Error en fetch admins", e); }
  };

  useEffect(() => { cargarMatriculaAlumno(); }, []);

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-info-caja" onClick={(e) => e.stopPropagation()}>
        <div className="modal-info-cabecera">
          <div>
            <h3 className="modal-info-nombre">{usuario.nombre} {usuario.apellidos}</h3>
            <p className="modal-info-correo">{usuario.username}</p>
          </div>
          <button className="modal-cerrar-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-info-cuerpo">
          <div className="info-grupo info-personal">
            <h4 className="info-grupo-titulo">Datos personales</h4>
            <div className="info-grid">
              <div className="info-campo"><span className="info-label">DNI</span><span className="info-valor">{usuario.dni || "—"}</span></div>
              <div className="info-campo"><span className="info-label">Fecha nacimiento</span><span className="info-valor">{usuario.fechaNacimiento || "—"}</span></div>
              <div className="info-campo"><span className="info-label">Dirección</span><span className="info-valor">{usuario.direccion || "—"}</span></div>
              <div className="info-campo"><span className="info-label">Fecha registro</span><span className="info-valor">{usuario.fechaRegistro || "—"}</span></div>
              <div className="info-campo"><span className="info-label">Teléfono</span><span className="info-valor">{usuario.telefono || "—"}</span></div>
            </div>
          </div>
          {matricula && matricula.length > 0 ? (
            matricula.map((m, i) => (
              <div className="info-grupos-grid" key={i}>
                <div className="info-grupo info-pagos">
                  <h4 className="info-grupo-titulo">Pagos</h4>
                  <div className="info-campo"><span className="info-label">Psicotécnico</span><span className={`info-badge ${m.psicotecnico ? "badge-si" : "badge-no"}`}>{m.psicotecnico ? "Sí" : "No"}</span></div>
                  <div className="info-campo"><span className="info-label">Pagó todo</span><span className={`info-badge ${m.pago ? "badge-si" : "badge-no"}`}>{m.pago ? "Sí" : "No"}</span></div>
                  <div className="info-campo"><span className="info-label">Pago tasa DGT</span><span className={`info-badge ${m.tasaDgt ? "badge-si" : "badge-no"}`}>{m.tasaDgt ? "Sí" : "No"}</span></div>
                </div>
                <div className="info-grupo info-examenes">
                  <h4 className="info-grupo-titulo">Fechas exámenes</h4>
                  <div className="info-campo"><span className="info-label">Examen teórico</span><span className="info-valor">{m.fechaTeorico || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Examen práctico</span><span className="info-valor">{m.fechaPractico || "—"}</span></div>
                </div>
                <div className="info-grupo info-profesor">
                  <h4 className="info-grupo-titulo">Profesor</h4>
                  <div className="info-campo"><span className="info-label">Nombre</span><span className="info-valor">{m.nombreProfesor || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Apellidos</span><span className="info-valor">{m.apellidosProfesor || "—"}</span></div>
                </div>
                <div className="info-grupo info-paquete">
                  <h4 className="info-grupo-titulo">Paquete</h4>
                  <div className="info-campo"><span className="info-label">Tipo carnet</span><span className="info-valor">{m.tiposCarnet || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Tipo paquete</span><span className="info-valor">{m.tipoPaquete || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Gestiones</span><span className="info-valor">{m.cantidadGestion ?? "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Clases conducir</span><span className="info-valor">{m.clasesConducir ?? "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Clases especiales</span><span className="info-valor">{m.clasesEspeciales ?? "—"}</span></div>
                </div>
                <div className="info-grupo info-vehiculo">
                  <h4 className="info-grupo-titulo">Vehículo</h4>
                  <div className="info-campo"><span className="info-label">Nº Vehículo</span><span className="info-valor">{m.idVehiculo || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Tipo vehículo</span><span className="info-valor">{m.tipoVehiculo || "—"}</span></div>
                  <div className="info-campo"><span className="info-label">Remolque</span><span className={`info-badge ${m.remolque ? "badge-si" : "badge-no"}`}>{m.remolque ? "Sí" : "No"}</span></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <p className="sin-matricula">Este usuario no tiene matrícula registrada. ¿Quiere registrar una nueva matricula?</p>
              <button>Añadir matricula</button> {/*BOTON AÑADIR MATRICULAAA*/}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA AÑADIR UN NUEVO USUARIO (ADMINISTRADOR, PROFESOR, ALUMNO Y CLIENTE)
function ModalAnadirUsuario({ visible, rolPorDefecto, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    dni: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    idRol: rolPorDefecto || "4", // Si no se especifica, por defecto cliente
  });

  useEffect(() => {
    setForm((f) => ({ ...f, idRol: rolPorDefecto || "4" })); //
  }, [rolPorDefecto, visible]);

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = () => {
    if (!form.username || !form.nombre || !form.apellidos || !form.password) {
      alert("Rellena al menos username, nombre, apellidos y contraseña.");
      return;
    }
    const payload = {
      ...form,
      rol: {
        idRol: Number(form.idRol),
      },
    };

    delete payload.idRol;

    console.log(payload);
    onGuardar(payload);
  };

  const nombreRol = { 1: "Administrador", 2: "Profesor", 3: "Alumno", 4: "Cliente" };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo={`Añadir ${nombreRol[form.rol]}`}>
      <div className="modal-anadir-cuerpo">
        <div className="anadir-campo-full">
          <label className="campo-label">Rol</label>
          <SelectorRolNumerico valor={form.idRol} onChange={(v) => cambiar("idRol", v)} />
        </div>
        <div className="anadir-grid">
          {[
            { campo: "username", label: "Username / Email", tipo: "email" },
            { campo: "password", label: "Contraseña", tipo: "password" },
            { campo: "nombre", label: "Nombre", tipo: "text" },
            { campo: "apellidos", label: "Apellidos", tipo: "text" },
            { campo: "fechaNacimiento", label: "Fecha nacimiento", tipo: "date" },
            { campo: "direccion", label: "Dirección", tipo: "text" },
            // { campo: "telefono", label: "Teléfono", tipo: "tel" },
          ].map(({ campo, label, tipo }) => (
            <div key={campo} className="anadir-campo">
              <label className="campo-label">{label}</label>
              <input className="campo-input" type={tipo} value={form[campo]}
                onChange={(e) => cambiar(campo, e.target.value)}
                placeholder={label}
              />
            </div>
          ))}
          <div className="anadir-campo">
            <label className="campo-label">Teléfono</label>
            <input
              className="campo-input"
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={form.telefono}
              onChange={(e) => {
                const valor = e.target.value;
                const regex = /^[0-9]{0,9}$/;
                if (regex.test(valor)) {
                  cambiar("telefono", valor);
                }
              }}
              placeholder="612345678"
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">DNI</label>
            <input
              className="campo-input"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={form.dni}
              onChange={(e) => {
                const valor = e.target.value.toUpperCase();
                const regex = /^[0-9]{0,8}[A-Z]?$/;

                if (regex.test(valor)) {
                  cambiar("dni", valor);
                }
              }
              }
              placeholder="12345678Z"
            />
          </div>
        </div>
        <button className="btn-guardar-usuario" onClick={guardar}>Crear {nombreRol[form.rol]}</button>
      </div>
    </Modal>
  );
}

function PanelLateral({ rolActivo, totalUsuarios, onAnadir }) {
  const username = obtenerUsername();
  const nombreSingular = {
    administradores: "Administrador",
    profesores: "Profesor",
    alumnos: "Alumno",
    clientes: "Cliente",
  };

  return (
    <aside className="panel-lateral">
      <div className="panel-avatar">
        <h3 className="panel-rol-nombre">{rolActivo.charAt(0).toUpperCase() + rolActivo.slice(1)}</h3>
        <p className="panel-rol-desc">Panel de control y gestión</p>
      </div>
      <div className="panel-estadistica">
        <span className="panel-estadistica-label">Total {rolActivo}</span>
        <span className="panel-estadistica-numero">{totalUsuarios ?? "—"}</span>
      </div>
      <div className="panel-estadistica">
        <span className="panel-estadistica-label">Sesión Activa</span>
        <span className="panel-estadistica-valor">{username}</span>
      </div>
      <div className="panel-acciones-extra">
        <button className="panel-boton-anadir" onClick={onAnadir}>Añadir {nombreSingular[rolActivo]}</button>
      </div>
    </aside>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
// TABLA ADMINISTRADORES

function TablaAdministradores({ mostrarAlerta }) {
  const [admins, setAdmins] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/1", { method: "GET", headers });
      if (res.ok) setAdmins(await res.json());
      else console.log("Error al obtener administradores");
    } catch (e) { console.log("Error en fetch admins", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarRol = async (usuario, nuevoRol) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/rol/modificar/${usuario.username}/${nuevoRol}`, {
        method: "PUT",
        headers,
      });
      if (res.ok) mostrarAlerta("¡Rol editado correctamente!", "exito");
      else mostrarAlerta("Error al cambiar el rol.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalRol(false);
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) mostrarAlerta("Administrador eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el administrador.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalBorrado(false);
    cargar();
  };

  return (
    <>
      <div className="tabla-bloque">
        <div className="tabla-cabecera">
          <h2 className="tabla-titulo">Administradores</h2>
          <span className="tabla-badge">{admins.length} registros</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Username</th><th>Nombre</th><th>Apellido</th><th>DNI</th>
                <th>Fecha Registro</th><th>Fecha Nacimiento</th><th>Dirección</th>
                <th>Teléfono</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">Sin datos — comprueba la conexión con el backend.</td></tr>
              ) : (
                admins.map((a, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{a.username}</td><td>{a.nombre}</td><td>{a.apellidos}</td>
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
    </>
  );
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
// TABLA PROFESORES

function TablaProfesores({ mostrarAlerta }) {
  const [profes, setProfes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalRol, setModalRol] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [alumnosAsignados, setAlumnosAsignados] = useState({}); // nuevo estado para almacenar alumnos asignados a cada profesor


  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/2", { method: "GET", headers });
      if (res.ok) setProfes(await res.json());
      else console.log("Error al obtener profesores");
    } catch (e) { console.log("Error en fetch profes", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarRol = async (usuario, nuevoRol) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/rol/modificar/${usuario.username}/${nuevoRol}`, {
        method: "PUT",
        headers,
      });
      if (res.ok) mostrarAlerta("¡Rol editado correctamente!", "exito");
      else mostrarAlerta("Error al cambiar el rol.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalRol(false);
    cargar();
  };

  const confirmarBorrar = async () => {

    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) mostrarAlerta("Profesor eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el profesor.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalBorrado(false);
    cargar();
  };

  const cargarAlumnosAsignadosProfe = async (usernameProfe) => { //carga los alumnos asignados a cada profesor

    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch(`http://localhost:9002/matricula/profe/${usernameProfe}`,
        { method: "GET", headers });

      if (res.ok) {
        const data = await res.json();
        // Guardamos los alumnos por profesor dentro de tu estado existente
        setAlumnosAsignados(prev => ({
          ...prev,               // conservamos los anteriores
          [usernameProfe]: data  // agregamos/actualizamos el profesor actual
        }));
      }
      else console.log("Error al obtener alumonos asignados a profesores");
      console.log("Alumnos asignados a profesores:", alumnosAsignados);

    } catch (e) {
      console.log("Error en fetch alumnos asignados a profesores", e);
    }
  };
  useEffect(() => {
    if (profes.length > 0) {
      profes.forEach((p) => {
        cargarAlumnosAsignadosProfe(p.username);
      });
    }
  }, [profes]); // Carga los alumnos asignados cada vez que se actualiza la lista de profesores

  return (
    <>
      <div className="tabla-bloque">
        <div className="tabla-cabecera">
          <h2 className="tabla-titulo">Profesores</h2>
          <span className="tabla-badge">{profes.length} registros</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Username</th><th>Nombre</th><th>Apellido</th><th>DNI</th>
                <th>Fecha Registro</th><th>Fecha Nacimiento</th><th>Dirección</th>
                <th>Teléfono</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profes.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">Sin datos — comprueba la conexión con el backend.</td></tr>
              ) : (
                profes.map((p, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{p.username}</td>
                    <td>{p.nombre}</td>
                    <td>{p.apellidos}</td>
                    <td>{p.dni}</td>
                    <td>{p.fechaRegistro}</td>
                    <td>{p.fechaNacimiento}</td>
                    <td>{p.direccion}</td>
                    <td>{p.telefono}</td>
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

                {profes.length === 0 ? (
                  <tr><td colSpan={9} className="tabla-vacia">Sin datos — comprueba la conexión con el backend.</td></tr>
                ) : (
                  profes.map((p, i) => (
                    <tr key={i} className="tabla-fila">
                      {/* Columna del profesor */}
                      <td>{p.username}</td>
                      <td>
                        {/* Columnas de sus alumnos */}
                        {alumnosAsignados[p.username] && alumnosAsignados[p.username].length > 0
                          ? `${alumnosAsignados[p.username].map(a => a).join(", ")}`
                          : "Sin alumnos asignados"}

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div >
      <ModalCambiarRol visible={modalRol} usuario={usuarioSeleccionado} onGuardar={guardarRol} onCerrar={() => setModalRol(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="profesor" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
    </>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
// TABLA ALUMNOS

function TablaAlumnos({ mostrarAlerta }) {
  const [alumnos, setAlumnos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/3", { method: "GET", headers });
      if (res.ok) setAlumnos(await res.json());
      else console.log("Error al obtener alumnos");
    } catch (e) { console.log("Error en fetch alumnos", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarEdicion = async (datos) => {
    const headers = obtenerAuthHeaders();

    if (datos.campo === "rol") {
      try {
        const res = await fetch(`http://localhost:9002/rol/modificar/${datos.username}/${datos.valor}`, {
          method: "PUT",
          headers,
        });
        if (res.ok) mostrarAlerta("¡Rol actualizado!", "exito");
        else mostrarAlerta("Error al cambiar el rol.", "error");
      } catch (e) {
        mostrarAlerta("Error de conexión.", "error");
      }
      cargar();
      return;
    }

    // Para dni y dirección mandamos el objeto completo con el campo sobreescrito
    const bodyCompleto = {
      username: datos.username,
      dni: datos.dni,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono,
      direccion: datos.direccion,
      [datos.campo]: datos.valor,
    };

    try {
      const res = await fetch(`http://localhost:9002/usuarios/modificar/${datos.username}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(bodyCompleto),
      });
      const mensajes = { dni: "DNI actualizado.", direccion: "Dirección actualizada." };
      if (res.ok) mostrarAlerta(mensajes[datos.campo], "exito");
      else mostrarAlerta("Error al guardar el cambio.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) mostrarAlerta("Alumno eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el alumno.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalBorrado(false);
    cargar();
  };

  return (
    <>
      <div className="tabla-bloque">
        <div className="tabla-cabecera">
          <h2 className="tabla-titulo">Alumnos</h2>
          <span className="tabla-badge">{alumnos.length} registros</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Username</th><th>Nombre</th><th>Apellido</th><th>DNI</th>
                <th>Fecha Registro</th><th>Fecha Nacimiento</th><th>Dirección</th>
                <th>Teléfono</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">Sin datos — comprueba la conexión con el backend.</td></tr>
              ) : (
                alumnos.map((a, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{a.username}</td><td>{a.nombre}</td><td>{a.apellidos}</td>
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
        <div className="subtabla-bloque">
          <h3 className="subtabla-titulo">Listado de Matrículas</h3>
          <div className="tabla-scroll">
            <table className="tabla subtabla">
              <thead><tr><th></th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalEditarUsuario visible={modalEditar} usuario={usuarioSeleccionado} tipo="alumno" onGuardar={guardarEdicion} onCerrar={() => setModalEditar(false)} />
      <ModalConfirmarBorrado visible={modalBorrado} tipo="alumno" onConfirmar={confirmarBorrar} onCancelar={() => setModalBorrado(false)} />
      <ModalVerInfo visible={modalVer} usuario={usuarioSeleccionado} onCerrar={() => setModalVer(false)} />
    </>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
// TABLA CLIENTES

function TablaClientes({ mostrarAlerta }) {
  const [clientes, setClientes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrado, setModalBorrado] = useState(false);
  const [modalVer, setModalVer] = useState(false);

  const cargar = async () => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch("http://localhost:9002/usuarios/todosdto/4", { method: "GET", headers });
      if (res.ok) setClientes(await res.json());
      else console.log("Error al obtener clientes");
    } catch (e) { console.log("Error en fetch clientes", e); }
  };

  useEffect(() => { cargar(); }, []);

  const guardarEdicion = async (datos) => {
    const headers = obtenerAuthHeaders();

    if (datos.campo === "rol") {
      try {
        const res = await fetch(`http://localhost:9002/rol/modificar/${datos.username}/${datos.valor}`, {
          method: "PUT",
          headers,
        });
        if (res.ok) mostrarAlerta("¡Rol actualizado!", "exito");
        else mostrarAlerta("Error al cambiar el rol.", "error");
      } catch (e) {
        mostrarAlerta("Error de conexión.", "error");
      }
      cargar();
      return;
    }

    const bodyCompleto = {
      username: datos.username,
      dni: datos.dni,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono,
      direccion: datos.direccion,
      [datos.campo]: datos.valor,
    };

    try {
      const res = await fetch(`http://localhost:9002/usuarios/modificar/${datos.username}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(bodyCompleto),
      });
      const mensajes = { dni: "DNI actualizado.", direccion: "Dirección actualizada." };
      if (res.ok) mostrarAlerta(mensajes[datos.campo], "exito");
      else mostrarAlerta("Error al guardar el cambio.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    cargar();
  };

  const confirmarBorrar = async () => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch(`http://localhost:9002/usuarios/eliminar/${usuarioSeleccionado.username}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) mostrarAlerta("Cliente eliminado.", "exito");
      else mostrarAlerta("Error al eliminar el cliente.", "error");
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalBorrado(false);
    cargar();
  };

  return (
    <>
      <div className="tabla-bloque">
        <div className="tabla-cabecera">
          <h2 className="tabla-titulo">Clientes</h2>
          <span className="tabla-badge">{clientes.length} registros</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Username</th><th>Nombre</th><th>Apellido</th><th>DNI</th>
                <th>Fecha Registro</th><th>Fecha Nacimiento</th><th>Dirección</th>
                <th>Teléfono</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={9} className="tabla-vacia">Sin datos — comprueba la conexión con el backend.</td></tr>
              ) : (
                clientes.map((c, i) => (
                  <tr key={i} className="tabla-fila">
                    <td>{c.username}</td><td>{c.nombre}</td><td>{c.apellidos}</td>
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
      <ModalVerInfo visible={modalVer} usuario={usuarioSeleccionado} onCerrar={() => setModalVer(false)} />
    </>
  );
}

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

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
function DashboardAdmin() {
  const username = obtenerUsername();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolActivo, setRolActivo] = useState("administradores");
  const [totalUsuarios, setTotalUsuarios] = useState(null);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "exito" });

  const obtenerNombreUsuario = async () => {
    try {
      const res = await fetch(`http://localhost:9002/usuarios/nombre/${username}`, { method: "GET" });
      if (res.ok) setNombreUsuario(await res.text());
      else console.log("Error al obtener nombre del usuario");
    } catch (e) { console.log("Error en fetch Nombre", e); }
  };

  useEffect(() => { obtenerNombreUsuario(); }, []);

  useEffect(() => {
    const ids = { administradores: 1, profesores: 2, alumnos: 3, clientes: 4 };
    const cargarTotal = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/usuarios/todosdto/${ids[rolActivo]}`, { method: "GET", headers });
        if (res.ok) { const d = await res.json(); setTotalUsuarios(d.length); }
        else setTotalUsuarios(null);
      } catch { setTotalUsuarios(null); }
    };
    cargarTotal();
  }, [rolActivo]);

  const mostrarAlerta = (mensaje, tipo = "exito") => {
    setAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => setAlerta((a) => ({ ...a, visible: false })), 3000);
  };

  const guardarNuevoUsuario = async (datos) => {
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/usuarios/alta", {
        method: "POST",
        headers,
        body: JSON.stringify(datos),
      });
      if (res.ok) mostrarAlerta("¡Usuario creado correctamente!", "exito");
      else {
        // Leer el mensaje del backend
        const data = await res.text(); 
        mostrarAlerta(data || "Error al crear el usuario.", "error");
      }
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    setModalAnadir(false);
  };

  const roles = ["administradores", "profesores", "alumnos", "clientes"];

  const renderTabla = () => {
    switch (rolActivo) {
      case "administradores": return <TablaAdministradores mostrarAlerta={mostrarAlerta} />;
      case "profesores": return <TablaProfesores mostrarAlerta={mostrarAlerta} />;
      case "alumnos": return <TablaAlumnos mostrarAlerta={mostrarAlerta} />;
      case "clientes": return <TablaClientes mostrarAlerta={mostrarAlerta} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-contenedor">
      <NavAzul />
      <AlertaFlotante mensaje={alerta.mensaje} tipo={alerta.tipo} visible={alerta.visible} />
      <div className="dashboard-bienvenida">
        <h1 className="bienvenida-texto">
          Bienvenido, <span className="bienvenida-nombre">{nombreUsuario}</span> al Dashboard
        </h1>
      </div>
      <div className="roles-tabs">
        {roles.map((rol) => (
          <button
            key={rol}
            className={`rol-tab ${rolActivo === rol ? "rol-tab-activo" : ""}`}
            onClick={() => setRolActivo(rol)}
          >
            {rol.charAt(0).toUpperCase() + rol.slice(1)}
          </button>
        ))}
      </div>
      <div className="dashboard-contenido">
        <div className="dashboard-tabla-zona">{renderTabla()}</div>
        <PanelLateral
          rolActivo={rolActivo}
          totalUsuarios={totalUsuarios}
          onAnadir={() => setModalAnadir(true)}
        />
      </div>
      <ModalAnadirUsuario
        visible={modalAnadir}
        rolPorDefecto={{ administradores: "1", profesores: "2", alumnos: "3", clientes: "4" }[rolActivo]}
        onGuardar={guardarNuevoUsuario}
        onCerrar={() => setModalAnadir(false)}
      />
    </div>
  );
}

export default DashboardAdmin;