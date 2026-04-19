import { PayPalButtons } from '@paypal/react-paypal-js';

function PagoPayPal({ idMatricula, onPagoExitoso, onPagoError }) {
    // PASO 1: Crear la orden en el backend
    const crearOrden = async () => {
        try {
            const response = await fetch(
                `http://localhost:9002/paypal/crear-orden/${idMatricula}`,
                { method: 'POST' }
            );
            const data = await response.json();
            // Devolvemos el orderID al SDK de PayPal
            return data.orderID;
        } catch (error) {
            console.error('Error creando orden:', error);
            onPagoError('No se pudo iniciar el pago. Inténtalo de nuevo.');
        }
    };
    
    // PASO 2: Capturar el pago tras la aprobación del usuario 
    const onApprove = async (data) => {
        try {
            const response = await fetch(
                `${API_URL}/paypal/capturar-orden/${data.orderID}?idMatricula=${idMatricula}`,
                { method: 'POST' }
            );
            const result = await response.json();
            if (result.status === 'PAGO_COMPLETADO') {
                onPagoExitoso(result);
            } else {
                onPagoError('El pago no se completó correctamente.');
            }
        } catch (error) {
            console.error('Error capturando orden:', error);
            onPagoError('Error al procesar el pago.');
        }
    };
    return (
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
            <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
                createOrder={crearOrden}
                onApprove={onApprove}
                onError={(err) => onPagoError('Error en PayPal: ' + err)}
                onCancel={() => onPagoError('Pago cancelado por el usuario.')}
            />
        </div>
    );
}
export default PagoPayPal;