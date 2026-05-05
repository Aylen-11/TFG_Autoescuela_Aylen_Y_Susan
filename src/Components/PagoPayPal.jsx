import { PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import './PagoPaypal.css';
import { obtenerUsername, obtenerAuthHeaders } from '../utils/auth'; // ajusta la ruta

const API_URL = 'http://localhost:9002';

function PagoPayPal({ precio, idPaquete, tipoPaquete, tipoCarnet, onPagoExitoso, onPagoError }) {
  const [idUsuario, setIdUsuario] = useState(null);
  const [usernameAlumno, setUsernameAlumno] = useState(null);
  const [estado, setEstado] = useState('idle');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const username = obtenerUsername();
    const headers = obtenerAuthHeaders();

    if (!username || !headers) {
      onPagoError("Sesión no encontrada. Inicia sesión de nuevo.");
      return;
    }

    setUsernameAlumno(username);

    fetch(`${API_URL}/usuarios/buscarid/${username}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error("Error " + res.status);
        return res.json();
      })
      .then(id => setIdUsuario(id))
      .catch(() => onPagoError("No se pudo identificar tu usuario."));
  }, []);


  const crearOrden = async () => {
    if (!idUsuario) {
      onPagoError("No se pudo identificar tu usuario.");
      throw new Error("idUsuario no disponible");
    }
    setEstado('procesando');

    const url = `${API_URL}/paypal/crear-orden?precio=${precio}&idUsuario=${idUsuario}&idPaquete=${idPaquete}`;
    const response = await fetch(url, {
      method: "POST",
      headers: obtenerAuthHeaders(),
    });

    if (!response.ok) {
      const err = `Error del servidor: ${response.status}`;
      setEstado('error');
      setMensajeError(err);
      onPagoError(err);
      throw new Error(err);
    }

    const data = await response.json();
    return data.orderID;
  };


  const registrarMatricula = async () => {
    const form = {
      psicotecnico: false,
      pago: true,
      tasaDgt: false,
      usernameAlumno,
      usernameProfesor: "profesor1@autoescuela.com",
      tiposCarnet: tipoCarnet,
      idVehiculo: 3,
      tipoPaquete: tipoPaquete,
      fechaTeorico: "2026-02-15",
      fechaPractico: "2026-02-15",
    };

    console.log("Registrando matrícula:", form);
    const headers = obtenerAuthHeaders();

    const res = await fetch('http://localhost:9002/matricula/alta-dto', {
      method: "POST",
      headers,
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error backend matrícula:", text);
      throw new Error(`Error registrando matrícula: ${res.status} - ${text}`);
    }

    return await res.json();
  };


  const onApprove = async (data) => {
    // 1️⃣ Capturar el pago en PayPal
    const response = await fetch(
      `${API_URL}/paypal/capturar-orden/${data.orderID}`,
      { method: "POST", headers: obtenerAuthHeaders() }
    );

    if (!response.ok) {
      setEstado('error');
      setMensajeError("Error al capturar el pago.");
      onPagoError("Error al capturar el pago.");
      return;
    }

    const result = await response.json();

    if (result.status === "PAGO_COMPLETADO") {
      try {
        // 2️⃣ Cambiar rol a alumno (rol 3) PRIMERO
        const resRol = await fetch(`${API_URL}/rol/modificar/${usernameAlumno}/3`, {
          method: "PUT",
          headers: obtenerAuthHeaders(),
        });

        if (!resRol.ok) {
          console.warn("Error cambiando rol:", resRol.status);
        } else {
          console.log("Rol cambiado a alumno correctamente");
        }

        // 3️⃣ Registrar matrícula DESPUÉS (ahora ya tiene rol alumno)
        const matricula = await registrarMatricula();
        console.log("Matrícula registrada:", matricula);

      } catch (err) {
        console.warn("Pago OK pero error en post-proceso:", err.message);
      } finally {
        setEstado('exito');
        onPagoExitoso(result);
        window.location.href = "/dashboard-alumno";
      }
    } else {
      // ← esto faltaba
      setEstado('error');
      setMensajeError("El pago no se completó correctamente.");
      onPagoError("El pago no se completó correctamente.");
    }
  };


  const handleError = (err) => {
    const msg = 'Error en PayPal: ' + err;
    setEstado('error');
    setMensajeError(msg);
    onPagoError(msg);
  };

  const handleCancel = () => {
    setEstado('idle');
    onPagoError('Pago cancelado por el usuario.');
  };

  return (
    <div className="pp-wrapper">
      <div className={`pp-card ${estado === 'procesando' ? 'pp-card--procesando' : ''} ${estado === 'exito' ? 'pp-card--exito' : ''} ${estado === 'error' ? 'pp-card--error' : ''}`}>
        <div className="pp-card__chip" />
        <div className="pp-card__logo">
          {estado === 'exito' && <span className="pp-icon pp-icon--ok">✓</span>}
          {estado === 'error' && <span className="pp-icon pp-icon--fail">✕</span>}
          {estado !== 'exito' && estado !== 'error' && <span className="pp-card__brand">PayPal</span>}
        </div>
        <div className="pp-card__numero">**** **** **** ***</div>
        <div className="pp-card__footer">
          <span className="pp-card__label">Total</span>
          <span className="pp-card__precio">{precio} €</span>
        </div>

        {estado === 'procesando' && (
          <div className="pp-overlay">
            <div className="pp-spinner" />
            <p>Procesando pago…</p>
          </div>
        )}
        {estado === 'exito' && (
          <div className="pp-overlay pp-overlay--exito">
            <span className="pp-big-icon">✓</span>
            <p>¡Pago completado!</p>
          </div>
        )}
        {estado === 'error' && (
          <div className="pp-overlay pp-overlay--error">
            <span className="pp-big-icon">x</span>
            <p>{mensajeError || 'Ocurrió un error'}</p>
          </div>
        )}
      </div>

      {(estado === 'idle' || estado === 'procesando') && (
        <div className="pp-paypal-area">
          {!idUsuario ? (
            <p className="pp-cargando">Cargando método de pago…</p>
          ) : (
            <PayPalButtons
              style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
              createOrder={crearOrden}
              onApprove={onApprove}
              onError={handleError}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}

      {estado === 'error' && (
        <button className="pp-btn-reintentar" onClick={() => setEstado('idle')}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

export default PagoPayPal;