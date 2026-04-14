import { useRef } from "react";
import { Link } from "react-router-dom";

const roles = [
  {
    key: "administradores",
    label: "Administradores",
    icono: "/imagenes/admin.png"
  },
  {
    key: "profesores",
    label: "Profesores",
    icono: "/imagenes/profesor.png"
  },
  {
    key: "alumnos",
    label: "Alumnos",
    icono: "/imagenes/alumno.png"
  },
  {
    key: "clientes",
    label: "Clientes", icono: "/imagenes/cliente.png"
  },
];

export function TopbarPerfil({ nombreUsuario, correoUsuario, rolEtiqueta, imagenPerfil, onImagenCambio }) {
  const inputImagenRef = useRef(null);

  return (
    <div
      className="topbar-perfil-usuario"
      onClick={() => inputImagenRef.current?.click()}
      title="Cambiar foto de perfil"
    ><div className="topbar-avatar-wrapper">

        {imagenPerfil
          ? <img src={imagenPerfil} alt="perfil" className="topbar-avatar-img" />
          : <img src="/imagenes/sinfoto.jpg" alt="perfil" className="topbar-avatar-img" />
        }
        <div className="topbar-avatar-overlay"><span></span></div>
      </div>

      <div className="topbar-perfil-info" style={{ alignItems: "flex-start" }}>
        <span className="topbar-perfil-nombre">{nombreUsuario}</span>
        <span className="topbar-perfil-correo">{correoUsuario || rolEtiqueta}</span>
      </div>

      <input
        ref={inputImagenRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const archivo = e.target.files[0];
          if (archivo) {
            const lector = new FileReader();
            lector.onload = (ev) => onImagenCambio(ev.target.result);
            lector.readAsDataURL(archivo);
          }
        }}
      />
    </div>
  );
}

export function NavLateral({ rolActivo, setRolActivo, totalPorRol }) {
  return (
    <aside className="sidebar-lateral">
      <div className="sidebar-logo-zona">
        <img src="/imagenes/footer.png" alt="logo" className="sidebar-logo-img" />
        <div className="sidebar-logo-texto">
          <span className="sidebar-logo-autoescuela">AUTOESCUELA</span>
          <div className="sidebar-logo-linea"></div>
          <span className="sidebar-logo-villarey">VILLAREY</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-seccion-titulo">GESTIÓN DE PERFILES</p>
        {roles.map(({ key, label, icono }) => (
          <button
            key={key}
            className={`sidebar-nav-item ${rolActivo === key ? "sidebar-nav-item--activo" : ""}`}
            onClick={() => setRolActivo(key)}
          >
            <span className="sidebar-nav-icono">
              <img src={icono} alt={label} className="sidebar-icon-img" />
            </span>
            <span className="sidebar-nav-label">{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-cerrar-sesion">
          <span className="sidebar-cerrar-icono">↩</span>
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}