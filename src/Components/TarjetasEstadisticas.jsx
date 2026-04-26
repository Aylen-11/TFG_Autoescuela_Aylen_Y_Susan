const categorias = [
  {
    key: "administradores",
    label: "Administradores",
    icono: "/imagenes/admin.png",
    color: "#1b439a"
  },
  {
    key: "profesores",
    label: "Profesores",
    icono: "/imagenes/profesor.png",
    color: "#7fb5da"
  },
  {
    key: "alumnos",
    label: "Alumnos",
    icono: "/imagenes/alumno.png",
    color: "#acc24c"
  },
  {
    key: "clientes",
    label: "Clientes",
    icono: "/imagenes/cliente.png",
    color: "#3da4a4"
  },
];

export function TarjetasEstadisticas({ totalPorRol, rolActivo, setRolActivo, modoDashboard = false }) {
  return (
    <div className={`tarjetas-estadisticas-grid ${modoDashboard ? "tarjetas-estadisticas-grid--dashboard" : ""}`}>
      {categorias.map(({ key, label, icono, color }) => (
        <button
          key={key}
          className={`tarjeta-estadistica ${rolActivo === key ? "tarjeta-estadistica--activa" : ""} ${modoDashboard ? "tarjeta-estadistica--grande" : ""}`}
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