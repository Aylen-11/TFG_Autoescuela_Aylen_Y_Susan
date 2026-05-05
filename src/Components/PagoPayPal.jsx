import { PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PagoPaypal.css';
import { obtenerUsername, obtenerAuthHeaders } from '../utils/auth';

const API_URL = 'http://localhost:9002';

function PagoPayPal({ precio, idPaquete, tipoPaquete, tipoCarnet, onPagoExitoso, onPagoError }) {
  const navigate = useNavigate();

  const [idUsuario, setIdUsuario]           = useState(null);
  const [usernameAlumno, setUsernameAlumno] = useState(null);
  const [estado, setEstado]                 = useState('idle');
  const [mensajeError, setMensajeError]     = useState('');

  // Refs para evitar el problema de closure en los callbacks de PayPal
  const idUsuarioRef      = useRef(null);
  const usernameAlumnoRef = useRef(null);

  // ── Cargar datos del usuario ──────────────────────────────────
  useEffect(() => {
    const username = obtenerUsername();
    const headers  = obtenerAuthHeaders();

    if (!username || !headers) {
      onPagoError("Sesión no encontrada. Inicia sesión de nuevo.");
      return;
    }

    setUsernameAlumno(username);
    usernameAlumnoRef.current = username;

    fetch(`${API_URL}/usuarios/buscarid/${username}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error("Error " + res.status);
        return res.json();
      })
      .then(id => {
        setIdUsuario(id);
        idUsuarioRef.current = id;
        console.log("✅ Usuario cargado — username:", username, "| idUsuario:", id);
      })
      .catch(err => {
        console.error("❌ Error cargando usuario:", err);
        onPagoError("No se pudo identificar tu usuario.");
      });
  }, []);

  // Log de props para detectar datos vacíos
  useEffect(() => {
    console.log("📦 PagoPayPal props:", { precio, idPaquete, tipoPaquete, tipoCarnet });
  }, [precio, idPaquete, tipoPaquete, tipoCarnet]);

  // ── 1. Crear orden en PayPal ──────────────────────────────────
  const crearOrden = async () => {
    const idUs = idUsuarioRef.current;
    if (!idUs) {
      onPagoError("No se pudo identificar tu usuario.");
      throw new Error("idUsuario no disponible");
    }
    setEstado('procesando');

    const url = `${API_URL}/paypal/crear-orden?precio=${precio}&idUsuario=${idUs}&idPaquete=${idPaquete}`;
    console.log("🔵 Creando orden PayPal:", url);

    const response = await fetch(url, {
      method:  "POST",
      headers: obtenerAuthHeaders(),
    });

    if (!response.ok) {
      const err = `Error del servidor al crear orden: ${response.status}`;
      setEstado('error');
      setMensajeError(err);
      onPagoError(err);
      throw new Error(err);
    }

    const data = await response.json();
    console.log("✅ Orden creada:", data.orderID);
    return data.orderID;
  };

  // ── 2. Capturar pago + crear matrícula + cambiar rol ──────────
  const onApprove = async (data) => {
    const username = usernameAlumnoRef.current;  // siempre actualizado gracias a la ref

    console.log("🟢 onApprove — username:", username);
    console.log("🟢 tipoCarnet:", tipoCarnet, "| tipoPaquete:", tipoPaquete, "| idPaquete:", idPaquete);

    // Normalizar el tipo de carnet a mayúsculas (el backend busca "B", "AM", etc.)
    const carnetFinal  = (tipoCarnet  || "B").toUpperCase();
    const paqueteFinal = tipoPaquete  || "Paquete Básico";

    const matriculaPayload = {
      psicotecnico:     false,
      pago:             true,
      tasaDgt:          false,
      usernameAlumno:   username,
      usernameProfesor: "profesor1@autoescuela.com",
      tiposCarnet:      carnetFinal,
      idVehiculo:       3,
      // ── IMPORTANTE: mandar idPaquete para que el backend lo busque por id ──
      idPaquete:        idPaquete,
      tipoPaquete:      paqueteFinal,   // como fallback si idPaquete no coincide
      fechaTeorico:     "2026-02-15",
      fechaPractico:    "2026-02-15",
    };

    console.log("📋 Payload matrícula:", JSON.stringify(matriculaPayload, null, 2));

    // ── A: Capturar pago y crear matrícula en el backend ─────────
    const response = await fetch(
      `${API_URL}/paypal/capturar-orden/${data.orderID}`,
      {
        method:  "POST",
        headers: { ...obtenerAuthHeaders(), "Content-Type": "application/json" },
        body:    JSON.stringify(matriculaPayload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Error capturando pago:", response.status, text);
      setEstado('error');
      setMensajeError("Error al capturar el pago.");
      onPagoError("Error al capturar el pago.");
      return;
    }

    const result = await response.json();
    console.log("✅ Respuesta captura:", result);

    if (result.status === "PAGO_COMPLETADO") {

      // ── B: Cambiar rol de cliente (4) a alumno (3) ────────────
      try {
        const resRol = await fetch(
          `${API_URL}/rol/modificar/${username}/3`,
          { method: "PUT", headers: obtenerAuthHeaders() }
        );
        if (resRol.ok) {
          console.log("✅ Rol cambiado a alumno (3) correctamente");
        } else {
          console.warn("⚠️ Error cambiando rol:", resRol.status);
        }
      } catch (err) {
        console.warn("⚠️ Error en cambio de rol:", err.message);
      }

      // ── C: Notificar éxito y redirigir al dashboard ───────────
      setEstado('exito');
      onPagoExitoso(result);

      setTimeout(() => {
        navigate("/alumno/dashboard");
      }, 2000);

    } else {
      console.error("❌ Estado inesperado de PayPal:", result);
      setEstado('error');
      setMensajeError("El pago no se completó correctamente.");
      onPagoError("El pago no se completó correctamente.");
    }
  };

  const handleError = (err) => {
    console.error("❌ Error PayPal SDK:", err);
    setEstado('error');
    setMensajeError('Error en PayPal: ' + err);
    onPagoError('Error en PayPal: ' + err);
  };

  const handleCancel = () => {
    setEstado('idle');
    onPagoError('Pago cancelado por el usuario.');
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="pp-wrapper">
      <div
        className={[
          "pp-card",
          estado === 'procesando' ? 'pp-card--procesando' : '',
          estado === 'exito'      ? 'pp-card--exito'      : '',
          estado === 'error'      ? 'pp-card--error'      : '',
        ].join(' ')}
      >
        <div className="pp-card__chip" />
        <div className="pp-card__logo">
          {estado === 'exito'  && <span className="pp-icon pp-icon--ok">✓</span>}
          {estado === 'error'  && <span className="pp-icon pp-icon--fail">✕</span>}
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
            <p style={{ fontSize: '13px', marginTop: '6px', opacity: 0.85 }}>
              Redirigiendo a tu área de alumno…
            </p>
          </div>
        )}

        {estado === 'error' && (
          <div className="pp-overlay pp-overlay--error">
            <span className="pp-big-icon">✕</span>
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
