import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const [verPasswordReg, setVerPasswordReg] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const [registro, setRegistro] = useState({
    username: "",
    password: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    telefono: ""
  });

  const handleEnvio = (e) => {
    const { name, value } = e.target;
    setRegistro({ ...registro, [name]: value });
  };

  const enviarRegister = async (e) => {
    e.preventDefault();
    try {
      const envioRespuesta = await fetch("http://localhost:9002/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro)
      });

      if (envioRespuesta.ok) {
        try {
          const buscarRol = await fetch(`http://localhost:9002/usuarios/buscarrol/${registro.username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          if (buscarRol.ok) {
            const id = await buscarRol.text();
            switch (id) {
              case "4": navigate("/Cursos"); break;
              default: window.alert("No se ha podido redirigir, inténtelo de nuevo");
            }
          }
        } catch (error) {
          console.log("Error fetch REDIRIGIR", error);
        }
      } else {
        window.alert("Error en el registro, este correo ya está registrado.");
      }
    } catch (error) {
      window.alert("Error en el registro, revisa los datos introducidos");
    }
  };

  const [login, setLogin] = useState({ username: "", password: "" });

  const handleEnvioL = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const enviarLogin = async (e) => {
    e.preventDefault();
    try {
      const envioRespuesta = await fetch("http://localhost:9002/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(`${login.username}:${login.password}`)
        }
      });

      if (envioRespuesta.ok) {
        try {
          const buscarRol = await fetch(`http://localhost:9002/usuarios/buscarrol/${login.username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });

          if (buscarRol.ok) {
            const id = await buscarRol.text();
            const credenciales = btoa(`${login.username}:${login.password}`);
            localStorage.setItem("auth", credenciales);
            localStorage.setItem("username", login.username);

            // ── Comprobar si hay un carrito pendiente de antes del login ──
            const carritoGuardado = sessionStorage.getItem("carritoAntesDePagar");
            if (carritoGuardado) {
              // Si el usuario era cliente (rol 4) y ahora sigue siéndolo,
              // mandarlo al carrito a terminar la compra
              if (id === "4" || id === "3") {
                sessionStorage.setItem("volverAlCarrito", "true");
                navigate("/Cursos?volverCarrito=true");
                return;
              }
            }

            switch (id) {
              case "1": navigate("/admin/dashboard"); break;
              case "2": navigate("/profesor/dashboard"); break;
              case "3": navigate("/alumno/dashboard"); break;
              case "4": navigate("/Cursos"); break;
              default: window.alert("No se ha podido redirigir, inténtelo de nuevo");
            }
          } else {
            console.log("Error al redirigir");
          }
        } catch (error) {
          console.log("Error fetch REDIRIGIR", error);
        }
      } else {
        window.alert("Error en el login, revisa los datos introducidos");
      }
    } catch (error) {
      window.alert("Error en el login, vuelve a intentarlo más tarde");
    }
  };

  return (
    <>
      <nav className="navbar-top">
        <div className="promo-container">
          <div className="promo-track">
            <span className="promo-text">
              MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS •
              INSCRÍBETE HOY • TENEMOS LOS MEJORES PRECIOS •
            </span>
            <span className="promo-text">
              MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS •
              INSCRÍBETE HOY • TENEMOS LOS MEJORES PRECIOS •
            </span>
          </div>
        </div>
      </nav>

      <nav className="navbar-main">
        <div className="logo-home">
          <img src="/imagenes/intento2.png" alt="logo" />
          <div className="logo-text">
            <span className="autoescuela">AUTOESCUELA</span>
            <div className="divider"></div>
            <span className="villarey">VILLAREY</span>
          </div>
        </div>
        <ul className="nav-main-links">
          <li><Link to="/">Inicio</Link></li>
        </ul>
      </nav>

      <div className="login-wrapper">
        <div className={`contenedor ${isRegister ? "right-panel-active" : ""}`}>

          {/* REGISTRO */}
          <div className="form-contenedor sign-up-contenedor">
            <form onSubmit={enviarRegister}>
              <h2>Regístrate Aquí</h2>
              <input type="text" placeholder="Email" name="username" value={registro.username} onChange={handleEnvio} required />
              <div className="password-wrapper">
                <input type={verPasswordReg ? "text" : "password"} placeholder="Contraseña" name="password" value={registro.password} onChange={handleEnvio} required />
                <span className="ojo" onClick={() => setVerPasswordReg(!verPasswordReg)}>
                  <img src={verPasswordReg ? "/imagenes/ojo-abierto.png" : "/imagenes/ojo-cerrado.png"} alt="ver contraseña" />
                </span>
              </div>
              <input type="text" placeholder="Nombre" name="nombre" value={registro.nombre} onChange={handleEnvio} required />
              <input type="text" placeholder="Apellido" name="apellidos" value={registro.apellidos} onChange={handleEnvio} required />
              <input type="date" name="fechaNacimiento" value={registro.fechaNacimiento} onChange={handleEnvio} required />
              <input type="tel" placeholder="+34 600 000 000" pattern="[0-9]{9}" maxLength="9" name="telefono" value={registro.telefono} onChange={handleEnvio} required />
              <button type="submit">Registrarse</button>
            </form>
          </div>

          {/* LOGIN */}
          <div className="form-contenedor sign-in-contenedor">
            <form onSubmit={enviarLogin}>
              <h2>Iniciar Sesión</h2>
              <input type="text" placeholder="Email" name="username" value={login.username} onChange={handleEnvioL} required />
              <div className="password-wrapper">
                <input type={verPassword ? "text" : "password"} placeholder="Contraseña" name="password" value={login.password} onChange={handleEnvioL} required />
                <span className="ojo" onClick={() => setVerPassword(!verPassword)}>
                  <img src={verPassword ? "/imagenes/ojo-abierto.png" : "/imagenes/ojo-cerrado.png"} alt="ver contraseña" />
                </span>
              </div>
              <button type="submit">Entrar</button>
            </form>
          </div>

          {/* PANEL */}
          <div className="cubrir-contenedor">
            <div className="cubrir">
              <div className="cubrir-panel cubrir-left">
                <h1>Bienvenido otra vez</h1>
                <button className="ghost" onClick={() => setIsRegister(false)}>Iniciar sesión</button>
              </div>
              <div className="cubrir-panel cubrir-right">
                <h1>¿Aún no tienes cuenta?</h1>
                <button className="ghost" onClick={() => setIsRegister(true)}>Registrarse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
