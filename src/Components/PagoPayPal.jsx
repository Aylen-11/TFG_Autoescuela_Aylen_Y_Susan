import { PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:9002';

function PagoPayPal({ precio, idPaquete, onPagoExitoso, onPagoError }) {
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const auth = localStorage.getItem("auth");


    console.log("username:", username);
    console.log("auth:", auth);

    if (!username || !auth) {
      console.log("No hay sesión guardada");
      onPagoError("Sesión no encontrada. Inicia sesión de nuevo.");
      return;
    }

    fetch(`${API_URL}/usuarios/buscarid/${username}`)
      .then(res => {
        console.log("Status buscarid:", res.status);
        if (!res.ok) throw new Error("Error " + res.status);
        return res.json();
      })
      .then(id => {
        console.log("idUsuario obtenido:", id);
        setIdUsuario(id);
      })
      .catch(err => {
        console.error("Error fetch buscarid:", err);
        onPagoError("No se pudo identificar tu usuario.");
      });
  }, []);

  const crearOrden = async () => {
    if (!idUsuario) {
      onPagoError("No se pudo identificar tu usuario.");
      throw new Error("idUsuario no disponible");
    }

    const auth = localStorage.getItem("auth");
    const url = `${API_URL}/paypal/crear-orden?precio=${precio}&idUsuario=${idUsuario}&idPaquete=${idPaquete}`;
    console.log("Llamando a:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": "Basic " + auth }
    });

    if (!response.ok) {
      const err = `Error del servidor: ${response.status}`;
      onPagoError(err);
      throw new Error(err);
    }

    const data = await response.json();
    console.log("OrderID creado:", data.orderID);
    return data.orderID;
  };

  const onApprove = async (data) => {
    const auth = localStorage.getItem("auth");
    const response = await fetch(
      `${API_URL}/paypal/capturar-orden/${data.orderID}`,
      { method: "POST", headers: { "Authorization": "Basic " + auth } }
    );

    if (!response.ok) { onPagoError("Error al capturar el pago."); return; }

    const result = await response.json();
    if (result.status === "PAGO_COMPLETADO") {
      onPagoExitoso(result);
    } else {
      onPagoError("El pago no se completó correctamente.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      {!idUsuario ? (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px' }}>
          Cargando método de pago...
        </p>
      ) : (
        <PayPalButtons
          style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
          createOrder={crearOrden}
          onApprove={onApprove}
          onError={(err) => onPagoError('Error en PayPal: ' + err)}
          onCancel={() => onPagoError('Pago cancelado por el usuario.')}
        />
      )}
    </div>
  );
}

export default PagoPayPal;