import React from "react";
import { Link } from "react-router-dom";
import "./Error.css";

function Error404() {
  return (
    <div className="error-page-wrapper">
      <div className="error-header">
        <img src="/imagenes/logo-home.png" alt="Logo Home" />
        <h1>ERROR 404</h1>
      </div>

      <div className="error-message">
        <h3>¿El GPS te ha desviado?</h3>
        <h3>¡No te preocupes, aquí te guiamos de vuelta!</h3>
      </div>

      <div className="error-action">
        <Link to="/" className="btn-home">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default Error404;