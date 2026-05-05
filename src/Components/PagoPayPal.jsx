import { PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import './PagoPaypal.css';

const API_URL = 'http://localhost:9002';

function PagoPayPal({ precio, idPaquete, tipoPaquete, tipoCarnet, onPagoExitoso, onPagoError }) {
  const [idUsuario, setIdUsuario]   = useState(null);
  const [usernameAlumno, setUsernameAlumno] = useState(null);
  const [estado, setEstado]         = useState('idle');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const username = localStorage.getItem("username");
    const auth     = localStorage.getItem("auth");

    if (!username || !auth) {
      onPagoError("Sesión no encontrada. Inicia sesión de nuevo.");
      return;
    }

    setUsernameAlumno(username); // guardamos el username directamente

    fetch(`${API_URL}/usuarios/buscarid/${username}`)
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

    const auth = localStorage.getItem("auth");
    const url  = `${API_URL}/paypal/crear-orden?precio=${precio}&idUsuario=${idUsuario}&idPaquete=${idPaquete}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": "Basic " + auth }
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


  const registrarMatricula = async (auth) => {
    // Buscamos datos del paquete para confirmar tipoPaquete exacto si hace falta
    // pero ya nos llega como prop, así que lo usamos directamente

    const payload = {
      psicotecnico: false,
      pago: true,
      tasaDgt: false,
      usernameAlumno: usernameAlumno,
      usernameProfesor: "profesor1@autoescuela.com",
      tiposCarnet: tipoCarnet,          // ej: "B", "AM", "C"…
      idVehiculo: 3,
      tipoPaquete: tipoPaquete,         // ej: "Básico coche", "Estándar motos"…
      fechaTeorico: null,
      fechaPractico: null,
    };

    console.log("Registrando matrícula:", payload);

    const res = await fetch(`${API_URL}/matricula/alta-dto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + auth,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error registrando matrícula: ${res.status} - ${text}`);
    }

    return await res.json(); // devuelve la matrícula creada
  };


  const onApprove = async (data) => {
    const auth = localStorage.getItem("auth");

    // 1️⃣ Capturar el pago en PayPal
    const response = await fetch(
      `${API_URL}/paypal/capturar-orden/${data.orderID}`,
      { method: "POST", headers: { "Authorization": "Basic " + auth } }
    );

    if (!response.ok) {
      setEstado('error');
      setMensajeError("Error al capturar el pago.");
      onPagoError("Error al capturar el pago.");
      return;
    }

    const result = await response.json();

    if (result.status === "PAGO_COMPLETADO") {
      // 2️⃣ Registrar la matrícula en la BBDD
      try {
        const matricula = await registrarMatricula(auth);
        console.log("Matrícula registrada:", matricula);
        setEstado('exito');
        onPagoExitoso(result);

        // 3️⃣ Redirigir al dashboard del alumno
        window.location.href = "/dashboard-alumno";
      } catch (err) {
        console.error(err);
        // El pago fue bien pero falló el alta de matrícula — avisamos pero no bloqueamos
        setEstado('exito');
        onPagoExitoso(result);
        console.warn("Pago completado pero error al registrar matrícula:", err.message);
        window.location.href = "/dashboard-alumno";
      }
    } else {
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
          {estado === 'exito'  && <span className="pp-icon pp-icon--ok">✓</span>}
          {estado === 'error'  && <span className="pp-icon pp-icon--fail">✕</span>}
          {estado !== 'exito' && estado !== 'error' && <span className="pp-card__brand">PayPal</span>}
        </div>
        <div className="pp-card__numero">**** **** **** ***</div>
        <div className="pp-card__footer">
          <span className="pp-card__label">Total</span>
          <span className="pp-card__precio">${precio} €</span>
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