export function AlertaFlotante({ mensaje, tipo, visible }) {
  if (!visible) return null;
  return (
    <div className={`alerta-flotante alerta-flotante--${tipo}`}>
      {mensaje}
    </div>
  );
}

/* ── Modal base ── */
export function Modal({ visible, onCerrar, titulo, children }) {
  if (!visible) return null;
  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-contenido">{children}</div>
      </div>
    </div>
  );
}

export function ModalConfirmarBorrado({ visible, tipo, onConfirmar, onCancelar }) {
  return (
    <Modal visible={visible} onCerrar={onCancelar} titulo="Confirmar eliminación">
      <div className="confirmar-cuerpo">
        <div className="confirmar-icono-svg">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L1 21h22L12 2z" fill="#ffffff" stroke="#003289" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="14" stroke="#004475" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17.5" r="1.2" fill="#002453" />
          </svg>
        </div>
        <p className="confirmar-texto">¿Seguro que quieres borrar este <strong>{tipo}</strong>?</p>
        <p className="confirmar-sub">Esta acción no se puede deshacer.</p>
        <div className="confirmar-botones">
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
          <button className="btn-confirmar-borrar" onClick={onConfirmar}>Sí, eliminar</button>
        </div>
      </div>
    </Modal>
  );
}
