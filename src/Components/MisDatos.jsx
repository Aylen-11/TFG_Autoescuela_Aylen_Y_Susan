import { useState, useEffect } from "react";
import { obtenerAuthHeaders, obtenerUsername } from "../utils/auth";
import "./MisDatos.css";

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

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const camposModificados = Object.keys(form).filter(
    (k) => form[k] !== formOriginal[k]
  ).length;

  const guardarDatos = async () => {
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
          onChange={cambiar}
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