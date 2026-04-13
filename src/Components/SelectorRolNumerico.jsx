const ROLES = [
  { num: "1", nombre: "Administrador" },
  { num: "2", nombre: "Profesor" },
  { num: "3", nombre: "Alumno" },
  { num: "4", nombre: "Cliente" },
];

export function SelectorRolNumerico({ valor, onChange }) {
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
