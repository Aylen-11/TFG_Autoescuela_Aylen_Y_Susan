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
    setRegistro({
      ...registro,
      [name]: value
    });
  };

  const enviarRegister = async (e) => {
    e.preventDefault();

    const nuevoUsuario = { ...registro };
    try {
      const envioRespuesta = await fetch("http://localhost:9002/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario)
      });

      if (envioRespuesta.ok) {
        //window.alert("Registro exitoso, ya puedes iniciar sesión");
        try {
          const buscarIdPorEmail = await fetch(`http://localhost:9002/usuarios/buscarrol/${registro.username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (buscarIdPorEmail.ok) {
            const id = await buscarIdPorEmail.text();
            console.log("ID recibido del backend:", id);
            console.log("redirigiendo...")
            switch (id) {
              case "4":
                navigate("/Cursos");
                break;
              default:
                window.alert("no se ha podido redirigir a la pagina correspondiente, intentelo de nuevo")
            }
          } else {
            console.log("Error al redirigir")
          }
        } catch (error) {
          console.log("Error fetch REDIRIGIR", error)
        }
      } else {
        window.alert("Error en el registro, este correo ya esta registrado.");
      }

      console.log("usuario REGISTRADO correctamente!")
    } catch (error) {
      console.log("Error fetch REGISTER")
      window.alert("Error en el registro, por favor revise los datos introducidos");
    }
  };

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const handleEnvioL = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value
    });
  };

  const enviarLogin = async (e) => {
    e.preventDefault();

    const nuevoLogin = { ...login };
    try {
      const envioRespuesta = await fetch("http://localhost:9002/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(`${login.username}:${login.password}`)
        }
      });

      if (envioRespuesta.ok) {
        //window.alert("Login exitoso");
        try {
          const buscarIdPorEmail = await fetch(`http://localhost:9002/usuarios/buscarrol/${login.username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (buscarIdPorEmail.ok) {
            const id = await buscarIdPorEmail.text();
            console.log("ID recibido del backend:", id);
            console.log("redirigiendo...")

            const credenciales = btoa(`${login.username}:${login.password}`);
            localStorage.setItem("auth", credenciales);

            switch (id) {
              case "1":
                navigate("/admin/dashboard");
                break;
              case "2":
                navigate("/profesor/dashboard");
                break;
              case "3":
                navigate("/alumno/dashboard");
                break;
              case "4":
                navigate("/Cursos");
                break;
              default:
                window.alert("no se ha podido redirigir a la pagina correspondiente, intentelo de nuevo")
            }
          } else {
            console.log("Error al redirigir")
          }
        } catch (error) {
          console.log("Error fetch REDIRIGIR", error)
        }
      } else {
        window.alert("Error en el login, por favor revise los datos introducidos");
      }
    } catch (error) {
      console.log("Error fetch LOGIN", error)
      window.alert("Error en el login, vuelvalo a intentar mas tarde");
    }
  };

  return (
    <>
      {/* NAV SUPERIOR */}
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

      {/* NAV PRINCIPAL */}
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

              <input
                type="text"
                placeholder="Email"
                name="username"
                value={registro.username}
                onChange={handleEnvio}
                required
              />

              <div className="password-wrapper">
                <input
                  type={verPasswordReg ? "text" : "password"}
                  placeholder="Contraseña"
                  name="password"
                  value={registro.password}
                  onChange={handleEnvio}
                  required
                />
                <span className="ojo" onClick={() => setVerPasswordReg(!verPasswordReg)}>
                  <img
                    src={verPasswordReg ? "/imagenes/ojo-abierto.png" : "/imagenes/ojo-cerrado.png"}
                    alt="ver contraseña"
                  />
                </span>
              </div>

              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={registro.nombre}
                onChange={handleEnvio}
                required
              />

              <input
                type="text"
                placeholder="Apellido"
                name="apellidos"
                value={registro.apellidos}
                onChange={handleEnvio}
                required
              />

              <input
                type="date"
                name="fechaNacimiento"
                value={registro.fechaNacimiento}
                onChange={handleEnvio}
                required
              />

              <input
                type="tel"
                placeholder="+34 600 000 000"
                pattern="[0-9]{9}"
                maxLength="9"
                name="telefono"
                value={registro.telefono}
                onChange={handleEnvio}
                required
              />

              <button type="submit">Registrarse</button>
            </form>
          </div>

          {/* LOGIN */}
          <div className="form-contenedor sign-in-contenedor">
            <form onSubmit={enviarLogin}>
              <h2>Iniciar Sesión</h2>

              <input
                type="text"
                placeholder="Email"
                name="username"
                value={login.username}
                onChange={handleEnvioL}
                required
              />

              <div className="password-wrapper">
                <input
                  type={verPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  name="password"
                  value={login.password}
                  onChange={handleEnvioL}
                  required
                />
                <span className="ojo" onClick={() => setVerPassword(!verPassword)}>
                  <img
                    src={verPassword ? "/imagenes/ojo-abierto.png" : "/imagenes/ojo-cerrado.png"}
                    alt="ver contraseña"
                  />
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
                <button className="ghost" onClick={() => setIsRegister(false)}>
                  Iniciar sesión
                </button>
              </div>

              <div className="cubrir-panel cubrir-right">
                <h1>¿Aún no tienes cuenta?</h1>
                <button className="ghost" onClick={() => setIsRegister(true)}>
                  Registrarse
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;