function ModalNuevaMatricula({ visible, onGuardar, onCerrar, usuario, mostrarAlerta }) {
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
    fechaPractico: "",
  });

  useEffect(() => {
    if (visible && usuario) {
      setForm((f) => ({ ...f, usernameAlumno: usuario }));
    }
  }, [visible, usuario]);

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const guardarMatricula = async () => {
    if (!form.tiposCarnet || !form.usernameAlumno) {
      mostrarAlerta("Completa al menos el tipo de carnet.", "error");
      return;
    }
    const headers = obtenerAuthHeaders();
    try {
      const res = await fetch("http://localhost:9002/matricula/alta-dto", {
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

  if (!visible) return null;

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-matricula-caja" onClick={(e) => e.stopPropagation()}>

        {/* ── CABECERA ── */}
        <div className="modal-matricula-head">
          <div>
            <p className="modal-matricula-titulo">Añadir matrícula</p>
            <p className="modal-matricula-sub">{usuario}</p>
          </div>
          <button className="modal-cerrar-btn" onClick={onCerrar}>✕</button>
        </div>

        {/* ── CUERPO ── */}
        <div className="modal-matricula-body">

          {/* SECCIÓN: Documentación y pagos */}
          <div className="matricula-seccion">
            <p className="matricula-seccion-label">Documentación y pagos</p>
            <div className="matricula-toggle-row">
              {[
                { campo: "psicotecnico", label: "Psicotécnico" },
                { campo: "pago",         label: "Todo pagado"  },
                { campo: "tasaDgt",      label: "Tasa DGT"     },
              ].map(({ campo, label }) => (
                <button
                  key={campo}
                  type="button"
                  className={`matricula-toggle-btn ${form[campo] ? "matricula-toggle-btn--si" : "matricula-toggle-btn--no"}`}
                  onClick={() => cambiar(campo, !form[campo])}
                >
                  <span className="matricula-toggle-label">{label}</span>
                  <span className="matricula-toggle-pill">{form[campo] ? "SÍ" : "NO"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="matricula-divider" />

          {/* SECCIÓN: Asignación */}
          <div className="matricula-seccion">
            <p className="matricula-seccion-label">Asignación</p>
            <div className="matricula-fields-grid">

              <div className="matricula-field-group">
                <label className="matricula-field-label">Profesor asignado</label>
                <select
                  className="campo-input"
                  value={form.usernameProfesor}
                  onChange={(e) => cambiar("usernameProfesor", e.target.value)}
                >
                  <option value="">Selecciona un profesor</option>
                  {profesores.map((p) => (
                    <option key={p.idUser} value={p.username}>
                      {p.nombre} {p.apellidos} ({p.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="matricula-field-group">
                <label className="matricula-field-label">Número de vehículo</label>
                <select
                  className="campo-input"
                  value={form.idVehiculo}
                  onChange={(e) => cambiar("idVehiculo", e.target.value)}
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehiculos.map((v) => (
                    <option key={v.idVehiculo} value={v.idVehiculo}>
                      {v.idVehiculo} — {v.marca} {v.modelo} ({v.tipo}){v.remolque ? " + remolque" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="matricula-field-group">
                <label className="matricula-field-label">Tipo de carnet</label>
                <select
                  className="campo-input"
                  value={form.tiposCarnet}
                  onChange={(e) => cambiar("tiposCarnet", e.target.value)}
                >
                  <option value="">Selecciona un tipo de carnet</option>
                  {carnets.map((c) => (
                    <option key={c.idCarnet} value={c.tipo}>
                      {c.tipos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="matricula-field-group">
                <label className="matricula-field-label">Tipo de paquete</label>
                <select
                  className="campo-input"
                  value={form.tipoPaquete}
                  onChange={(e) => cambiar("tipoPaquete", e.target.value)}
                >
                  <option value="">Selecciona un tipo de paquete</option>
                  {tipoPaquetes.map((p) => (
                    <option key={p.idPaquete} value={p.tipoPaquete}>
                      {p.tipo}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="matricula-divider" />

          {/* SECCIÓN: Fechas de examen */}
          <div className="matricula-seccion">
            <p className="matricula-seccion-label">Fechas de examen</p>
            <div className="matricula-fields-grid">
              <div className="matricula-field-group">
                <label className="matricula-field-label">Examen teórico</label>
                <input
                  className="campo-input"
                  type="date"
                  value={form.fechaTeorico}
                  onChange={(e) => cambiar("fechaTeorico", e.target.value)}
                />
              </div>
              <div className="matricula-field-group">
                <label className="matricula-field-label">Examen práctico</label>
                <input
                  className="campo-input"
                  type="date"
                  value={form.fechaPractico}
                  onChange={(e) => cambiar("fechaPractico", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="matricula-divider" />

          {/* SECCIÓN: Alumno (solo lectura) */}
          <div className="matricula-seccion">
            <p className="matricula-seccion-label">Alumno</p>
            <div className="matricula-field-group matricula-field-group--full">
              <label className="matricula-field-label">Correo del alumno</label>
              <input
                className="campo-input"
                type="text"
                value={form.usernameAlumno}
                readOnly
                style={{ background: "#f4f8ff", color: "#6b7d96", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* BOTÓN CREAR */}
          <button className="btn-guardar-usuario" onClick={guardarMatricula}>
            CREAR MATRÍCULA
          </button>

        </div>
      </div>
    </div>
  );
}