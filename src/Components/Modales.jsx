import { useState, useEffect, use, Fragment } from "react";
import { Modal } from "./SharedUI";
import { SelectorRolNumerico } from "./SelectorRolNumerico";
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth";

/* modal de cambiar rol*/
export function ModalCambiarRol({ visible, usuario, onGuardar, onCerrar }) {
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

/*modal para editar Usuario*/
export function ModalEditarUsuario({ visible, usuario, tipo, onGuardar, onCerrar }) {
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
            <input
              className="campo-input"
              type="text"
              value={dni}
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
                <p>
                  <strong>Warning:</strong> Los datos deben coincidir con los de la persona real.
                  En caso de falsificación será penalizado de manera jurídica.{" "}
                  <em>Ley Orgánica 10/1995, arts. 390-394.</em>
                </p>
                <p className="aviso-confirmar">Pulsa <strong>Confirmar</strong> para guardar el cambio de DNI.</p>
              </div>
            </div>
          )}
          <div className="editar-fila editar-fila--mt">
            <label className="campo-label-inline">Dirección:</label>
            <input
              className="campo-input"
              type="text"
              value={direccion}
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

/*modal Añadir Usuario */
export function ModalAnadirUsuario({ visible, rolPorDefecto, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    dni: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    idRol: rolPorDefecto || "4",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, idRol: rolPorDefecto || "4" }));
  }, [rolPorDefecto, visible]);

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = () => {
    if (!form.username || !form.nombre || !form.apellidos || !form.password) {
      alert("Rellena al menos username, nombre, apellidos y contraseña.");
      return;
    }
    const payload = { ...form, rol: { idRol: Number(form.idRol) } };
    delete payload.idRol;
    onGuardar(payload);
  };

  const nombreRol = { 1: "Administrador", 2: "Profesor", 3: "Alumno", 4: "Cliente" };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo={`Añadir ${nombreRol[form.idRol]}`}>
      <div className="modal-anadir-cuerpo">
        <div className="anadir-grid">
          {[
            { campo: "username",        label: "Username / Email", tipo: "email" },
            { campo: "password",        label: "Contraseña",       tipo: "password" },
            { campo: "nombre",          label: "Nombre",           tipo: "text" },
            { campo: "apellidos",       label: "Apellidos",        tipo: "text" },
            { campo: "fechaNacimiento", label: "Fecha nacimiento", tipo: "date" },
            { campo: "direccion",       label: "Dirección",        tipo: "text" },
          ].map(({ campo, label, tipo }) => (
            <div key={campo} className="anadir-campo">
              <label className="campo-label">{label}</label>
              <input
                className="campo-input"
                type={tipo}
                value={form[campo]}
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
                const v = e.target.value;
                if (/^[0-9]{0,9}$/.test(v)) cambiar("telefono", v);
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
                const v = e.target.value.toUpperCase();
                if (/^[0-9]{0,8}[A-Z]?$/.test(v)) cambiar("dni", v);
              }}
              placeholder="12345678Z"
            />
          </div>
        </div>

        <button className="btn-guardar-usuario" onClick={guardar}>
          Crear {nombreRol[form.idRol]}
        </button>
      </div>
    </Modal>
  );
}


/* =========================
   MODAL AÑADIR MATRÍCULA
========================= */
export function ModalAnadirMatricula({ visible, onGuardar, onCerrar, usuario }) {
  const [form, setForm] = useState({
    psicotecnico: false,
    pago: false,
    tasaDgt: false,
    usernameAlumno: "",
    usernameProfesor: "",
    tiposCarnet: "",
    idVehiculo: "",
    tipoPaquete: "",
    fechaTeorico: "",
    fechaPractico: ""
  });

  // Autocompletar alumno cuando abre el modal
  useEffect(() => {
    if (visible && usuario) {
      setForm((f) => ({
        ...f,
        usernameAlumno: usuario.username || usuario
      }));
    }
  }, [visible, usuario]);

  const cambiar = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardar = () => {
    if (!form.usernameAlumno || !form.tiposCarnet) {
      alert("Completa al menos alumno y tipo de carnet.");
      return;
    }

    onGuardar(form);
  };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo="Añadir matrícula">
      <div className="modal-anadir-cuerpo">
        <div className="anadir-grid">

          {/* BOOLEANOS */}
          <div className="anadir-campo">
            <label className="campo-label">Psicotécnico</label>
            <button
              type="button"
              className={`info-badge ${form.psicotecnico ? "badge-si" : "badge-no"}`}
              onClick={() => cambiar("psicotecnico", !form.psicotecnico)}
            >
              {form.psicotecnico ? "Sí" : "No"}
            </button>
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Pago completo</label>
            <button
              type="button"
              className={`info-badge ${form.pago ? "badge-si" : "badge-no"}`}
              onClick={() => cambiar("pago", !form.pago)}
            >
              {form.pago ? "Sí" : "No"}
            </button>
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Tasa DGT</label>
            <button
              type="button"
              className={`info-badge ${form.tasaDgt ? "badge-si" : "badge-no"}`}
              onClick={() => cambiar("tasaDgt", !form.tasaDgt)}
            >
              {form.tasaDgt ? "Sí" : "No"}
            </button>
          </div>

          {/* TEXTOS */}
          <div className="anadir-campo">
            <label className="campo-label">Alumno</label>
            <input
              className="campo-input"
              type="text"
              value={form.usernameAlumno}
              onChange={(e) => cambiar("usernameAlumno", e.target.value)}
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Profesor</label>
            <input
              className="campo-input"
              type="text"
              value={form.usernameProfesor}
              onChange={(e) => cambiar("usernameProfesor", e.target.value)}
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Tipo carnet</label>
            <input
              className="campo-input"
              type="text"
              value={form.tiposCarnet}
              onChange={(e) => cambiar("tiposCarnet", e.target.value)}
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Vehículo</label>
            <input
              className="campo-input"
              type="text"
              value={form.idVehiculo}
              onChange={(e) => cambiar("idVehiculo", e.target.value)}
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Tipo paquete</label>
            <input
              className="campo-input"
              type="text"
              value={form.tipoPaquete}
              onChange={(e) => cambiar("tipoPaquete", e.target.value)}
            />
          </div>

          {/* FECHAS */}
          <div className="anadir-campo">
            <label className="campo-label">Fecha teórico</label>
            <input
              className="campo-input"
              type="date"
              value={form.fechaTeorico}
              onChange={(e) => cambiar("fechaTeorico", e.target.value)}
            />
          </div>

          <div className="anadir-campo">
            <label className="campo-label">Fecha práctico</label>
            <input
              className="campo-input"
              type="date"
              value={form.fechaPractico}
              onChange={(e) => cambiar("fechaPractico", e.target.value)}
            />
          </div>

        </div>
      </div>

      <button className="btn-guardar-usuario" onClick={guardar}>
        Crear matrícula
      </button>
    </Modal>
  );
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA AÑADIR UN NUEVA MATRICULA(ALUMNO Y CLIENTE)
function ModalNuevaMatricula({ visible, onGuardar, onCerrar, usuario, mostrarAlerta }) {
  //DROPDOWNS CON TODA LA INFORMACION DE ALUMNO, TIPO CARNET, ID VEHICULO Y TIPO PAQUETE
  const [profesores, setProfesores] = useState([]);
  const [carnets, setCarnets] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [tipoPaquetes, setTipoPaquetes] = useState([]);

  useEffect(() => {
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    const cargaDropdowns = async () => {
      try {
        const [resProfesores, resCarnets, resVehiculos, resPaquetes] = await Promise.all([
          fetch("http://localhost:9002/usuarios/rol/2", { method: "GET", headers }),
          fetch("http://localhost:9002/carnet/todos", { method: "GET", headers }),
          fetch("http://localhost:9002/vehiculo/todos", { method: "GET", headers }),
          fetch("http://localhost:9002/paquete/todos", { method: "GET", headers }),
        ]);
        if (resProfesores.ok) setProfesores(await resProfesores.json());
        if (resCarnets.ok) setCarnets(await resCarnets.json());
        if (resVehiculos.ok) setVehiculos(await resVehiculos.json());
        if (resPaquetes.ok) setTipoPaquetes(await resPaquetes.json());
      } catch (e) {
        console.log("Error al cargar datos para dropdowns", e);
      }
    };
    cargaDropdowns();
  }, [visible]);


  const [form, setForm] = useState({
    psicotecnico: false,
    pago: false,
    tasaDgt: false,
    usernameAlumno: "",
    usernameProfesor: "",
    tiposCarnet: "",
    idVehiculo: "",
    tipoPaquete: "",
    fechaTeorico: "",
    fechaPractico: ""
  });

  // Al abrir el modal, autocompleta el usernameAlumno
  useEffect(() => {
    if (visible && usuario) {
      setForm((f) => ({ ...f, usernameAlumno: usuario }));
    }
  }, [visible, usuario]);

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardarMatricula = async () => {
    if (!form) {
      alert("Completa todos los campos");
      return;
    }
    console.log("Guardando matrícula con datos:", form);
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch('http://localhost:9002/matricula/alta-dto', { //<- lo ha escrito alvaro :D
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        mostrarAlerta("¡Matrícula creada correctamente!", "exito");
      } else {
        mostrarAlerta("Error al registrar la matrícula.", "error");
      }
    } catch (e) {
      mostrarAlerta("Error de conexión.", "error");
    }
    onCerrar();
  };

  return (
    <Modal visible={visible} onCerrar={onCerrar} titulo={`Añadir matrícula para ${usuario}`}>
      <div className="modal-anadir-cuerpo">
        <div className="anadir-grid">
          {[
            { campo: "psicotecnico", label: "¿Tiene el psicotécnico?", tipo: "boolean" },
            { campo: "pago", label: "¿Tiene todo pagado ya?", tipo: "boolean" },
            { campo: "tasaDgt", label: "¿Tiene pagada la tasa de la DGT?", tipo: "boolean" },

            { campo: "usernameProfesor", label: "Profesor asignado", tipo: "profesor" },
            { campo: "tiposCarnet", label: "Tipo de carnet", tipo: "carnet" },
            { campo: "idVehiculo", label: "Número de vehículo asignado", tipo: "vehiculo" },
            { campo: "tipoPaquete", label: "Tipo de paquete", tipo: "paquete" },

            { campo: "fechaTeorico", label: "Fecha examen teórico", tipo: "date" },
            { campo: "fechaPractico", label: "Fecha examen práctico", tipo: "date" },
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
              ) : tipo === "profesor" ? (
                <select
                  className="campo-input"
                  value={form[campo]}
                  onChange={(e) => cambiar(campo, e.target.value)}
                >
                  <option value="">Selecciona un profesor</option>
                  {profesores.map((p) => (
                    <option key={p.idUser} value={p.username}>
                      {p.nombre} {p.apellidos} ({p.username})
                    </option>
                  ))}
                </select>
              ) : tipo === "carnet" ? (
                <select
                  className="campo-input"
                  value={form[campo]}
                  onChange={(e) => cambiar(campo, e.target.value)}
                >
                  <option value="">Selecciona un tipo de carnet</option>
                  {carnets.map((c) => (
                    <option key={c.idCarnet} value={c.tipo}>
                      {c.tipos}
                    </option>
                  ))}
                </select>
              ) : tipo === "vehiculo" ? (
                <select
                  className="campo-input"
                  value={form[campo]}
                  onChange={(e) => cambiar(campo, e.target.value)}
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehiculos.map((v) => (
                    <option key={v.idVehiculo} value={v.idVehiculo}>
                      {v.idVehiculo} - {v.marca}- {v.modelo} - {v.tipo} {v.remolque ? "(con remolque)" : ""}
                    </option>
                  ))}
                </select>
              ) : tipo === "paquete" ? (
                <select
                  className="campo-input"
                  value={form[campo]}
                  onChange={(e) => cambiar(campo, e.target.value)}
                >
                  <option value="">Selecciona un tipo de paquete</option>
                  {tipoPaquetes.map((p) => (
                    <option key={p.idPaquete} value={p.tipoPaquete}>
                      {p.tipo}
                    </option>
                  ))}
                </select>
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

          {/* Campo usernameAlumno autocompletado y solo lectura */}
          <div className="anadir-campo">
            <label className="campo-label">Alumno asignado</label>
            <input
              className="campo-input"
              type="text"
              value={form.usernameAlumno}
              readOnly
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>
        </div>
      </div>
      <button className="btn-guardar-usuario" onClick={guardarMatricula}>Crear</button>
    </Modal>
  );
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//MODAL PARA VER INFORMACIÓN COMPLETA DE UN USUARIO (SOLO EN ALUMNOS Y CLIENTES)
export function ModalVerInfo({ visible, usuario, onCerrar, mostrarAlerta }) {
  const [modalNuevaMatricula, setModalNuevaMatricula] = useState(false);
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

  useEffect(() => {
    if (visible && usuario) cargarMatriculaAlumno();
  }, [visible, usuario]);

  if (!visible || !usuario) return null;

  return (
    <>
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
            {matricula.length > 1 &&
              <>
                <hr className="info-separador" />
                <h4 className="info-matricula-titulo">Matriculas registradas</h4>
              </>
            }
            {matricula && matricula.length > 0 ? (
              matricula.map((m, i) => (
                <Fragment key={i}>
                  <div className="info-grupos-grid">
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
                  {matricula.length > 1 && <hr className="info-separador" />}
                  {i === matricula.length - 1 && (
                    <div className="modal-matricula-footer">
                      <button className="btn-guardar-usuario" onClick={() => setModalNuevaMatricula(true)} >Añadir matrícula</button>
                    </div>
                  )}
                </Fragment>
              ))
            ) : (
              <>
                <p className="sin-matricula">Este usuario no tiene matrícula registrada. ¿Quiere registrar una nueva matricula?</p>
                <button onClick={() => setModalNuevaMatricula(true)}>Añadir matricula</button>
              </>
            )}
          </div>
        </div>
      </div>
      <ModalNuevaMatricula
        visible={modalNuevaMatricula}
        usuario={usuario.username}
        onCerrar={() => setModalNuevaMatricula(false)}
        mostrarAlerta={mostrarAlerta}
      />
    </>
  );
}

// EDITAR DATOS DE UN USUARIO 
const CAMPOS = [
  { key: "username",        label: "Correo electrónico", type: "email", full: true },
  { key: "nombre",          label: "Nombre",             type: "text"  },
  { key: "apellidos",       label: "Apellidos",          type: "text"  },
  { key: "dni",             label: "DNI",                type: "text",  mono: true },
  { key: "telefono",        label: "Teléfono",           type: "tel",   mono: true },
  { key: "fechaNacimiento", label: "Fecha de nacimiento",type: "date"  },
  { key: "direccion",       label: "Dirección",          type: "text"  },
];

function CampoEditable({ campo, valor, onChange }) {
  const [editando, setEditando] = useState(false);
  const [local, setLocal]       = useState(valor);
  const [previo, setPrevio]     = useState(valor);

  useEffect(() => { if (!editando) setLocal(valor); }, [valor]);

  const activar   = () => { setPrevio(local); setEditando(true); };
  const confirmar = () => { setEditando(false); onChange(campo.key, local); };
  const cancelar  = () => { setLocal(previo); setEditando(false); onChange(campo.key, previo); };

  return (
    <div className={`mis-datos-campo${campo.full ? " mis-datos-campo--full" : ""}${editando ? " mis-datos-campo--editando" : ""}`}>
      <label className="campo-label">{campo.label}</label>
      <div className="mis-datos-campo-fila">
        <input
          className={`campo-input${campo.mono ? " campo-input--mono" : ""}`}
          type={campo.type}
          readOnly={!editando}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        {!editando ? (
          <button className="mis-datos-btn mis-datos-btn--lapiz" onClick={activar}>✏</button>
        ) : (
          <>
            <button className="mis-datos-btn mis-datos-btn--ok" onClick={confirmar}>✓</button>
            <button className="mis-datos-btn mis-datos-btn--x"  onClick={cancelar}>✕</button>
          </>
        )}
      </div>
    </div>
  );
}

export function MisDatos({ mostrarAlerta }) {
  const username = obtenerUsername();

  // mismo patrón que tu ejemplo
  const [form, setForm] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
  });
  const [formOriginal, setFormOriginal] = useState({});
  const [guardando, setGuardando]       = useState(false);

  // Autocarga de datos al montar, igual que tu useEffect con visible+usuario
  useEffect(() => {
    const cargar = async () => {
      const headers = obtenerAuthHeaders();
      if (!headers) return;
      try {
        const res = await fetch(`http://localhost:9002/usuarios/usuario-username-dto/${username}`, {
          method: "GET",
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setForm(data);
          setFormOriginal(data);
        }
      } catch (e) {
        console.log("Error cargando mis datos", e);
      }
    };
    cargar();
  }, [username]);

  // mismo patrón que tu cambiar()
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const camposModificados = Object.keys(form).filter(
    (k) => form[k] !== formOriginal[k]
  ).length;

  const guardarDatos = async () => {
    console.log("Guardando mis datos:", form);
    const headers = obtenerAuthHeaders();
    if (!headers) return;
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:9002/usuarios/modificar/${username}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormOriginal({ ...form });
        mostrarAlerta("Datos actualizados correctamente", "exito");
      } else {
        mostrarAlerta("Error al actualizar los datos", "error");
      }
    } catch (e) {
      mostrarAlerta("Error de conexión", "error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mis-datos-grid">
      {CAMPOS.map((campo) => (
        <CampoEditable
          key={campo.key}
          campo={campo}
          valor={form[campo.key] || ""}
          onChange={cambiar}   // le pasas tu cambiar directamente
        />
      ))}

      <div className="mis-datos-footer">
        <p className="info-cambios">
          {camposModificados === 0
            ? "Sin cambios pendientes"
            : <><span>{camposModificados} campo{camposModificados > 1 ? "s" : ""}</span> con cambios pendientes</>
          }
        </p>
        <button
          className="btn-guardar-usuario"
          style={{ width: "auto", padding: "10px 22px" }}
          onClick={guardarDatos}
          disabled={camposModificados === 0 || guardando}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}