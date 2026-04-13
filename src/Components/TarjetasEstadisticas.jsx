import { useRef } from "react";
import { Link } from "react-router-dom";

const categorias = [
  {
    key: "administradores",
    label: "Administradores",
    icono: "/imagenes/admin.png",
    color: "#002983"
  },
  {
    key: "profesores",
    label: "Profesores",
    icono: "/imagenes/profesor.png",
    color: "#04568c"
  },
  {
    key: "alumnos",
    label: "Alumnos",
    icono: "/imagenes/alumno.png",
    color: "#2989dc"
  },
  {
    key: "clientes",
    label: "Clientes",
    icono: "/imagenes/cliente.png",
    color: "#25d3cb"
  },
];

export function TarjetasEstadisticas({ totalPorRol, rolActivo, setRolActivo }) {
  return (
    <div className="tarjetas-estadisticas-grid">
      {categorias.map(({ key, label, icono, color }) => (
        <button
          key={key}
          className={`tarjeta-estadistica ${rolActivo === key ? "tarjeta-estadistica--activa" : ""}`}
          style={{ "--tarjeta-color": color }}
          onClick={() => setRolActivo(key)}
        >
          <div className="tarjeta-icono-zona">
            <img src={icono} alt={label} className="tarjeta-icono-img" />
          </div>
          <div className="tarjeta-datos">
            <span className="tarjeta-numero">{totalPorRol[key] ?? "—"}</span>
            <span className="tarjeta-label">{label}</span>
          </div>
          <div className="tarjeta-barra-activa"></div>
        </button>
      ))}
    </div>
  );
}

