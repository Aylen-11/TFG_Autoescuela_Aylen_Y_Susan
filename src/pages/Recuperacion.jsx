import { Link } from "react-router-dom";
import { useState } from "react";
import { SharedFooter } from "./Home";
import "./Recuperacion.css";

const sedes = [
    "Autoescuela Villarey - Centro (Gran Vía, 45)",
    "Autoescuela Villarey - Sur (Av. del Sur, 123)",
    "Autoescuela Villarey - Este (C. del Este, 12)",
    "Autoescuela Villarey - Oeste (Av. del Oeste, 56)",
    "Autoescuela Villarey - Chamartín (P. de la Habana, 10)",
    "Autoescuela Villarey - Retiro (C. de Alcalá, 200)",
    "Autoescuela Villarey - Moncloa (Glorieta de Moncloa, 5)",
    "Autoescuela Villarey - Tribunal (C. Serrano, 50)",
    "Autoescuela Villarey - Chamberí (C. José Abascal, 30)",
];

const faqs = [
    {
        pregunta: "¿Cómo recuperar los puntos del carnet?",
        respuesta:
            "Para recuperar puntos del carnet de conducir debes realizar un curso homologado de recuperación de puntos en una autoescuela autorizada. El curso incluye clases teóricas y prácticas sobre educación vial, y al finalizarlo se te restituirán los puntos correspondientes.",
    },
    {
        pregunta: "¿Cuántos puntos recuperaré con los cursos de Recuperación de Puntos?",
        respuesta:
            "Con el curso de Recuperación Parcial (10 horas) puedes recuperar hasta 4 puntos. Con el curso de Recuperación Total (20 horas) puedes recuperar hasta 8 puntos. Recuerda que solo puedes realizar un curso de recuperación cada 2 años.",
    },
    {
        pregunta: "¿Cuánto tiempo debe transcurrir desde la pérdida de todos los puntos para recuperarlos?",
        respuesta:
            "Si has perdido todos tus puntos (el permiso queda sin vigencia), deberás esperar 2 años antes de poder volver a obtener el carnet. Pasado ese plazo, tendrás que superar nuevamente los exámenes teórico y práctico.",
    },
    {
        pregunta: "¿Cómo recuperar el permiso de conducir?",
        respuesta:
            "Si se te ha retirado el permiso por pérdida total de puntos, tras los 2 años de inhabilitación deberás realizar de nuevo todos los trámites: examen médico, psicotécnico, teórico y práctico de conducción.",
    },
];


const handlePhoneInput = (e, setter, field, form) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 9);
    setter({ ...form, [field]: val });
};


function RecuperacionPuntos() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        centro: "",
        tipoRecuperacion: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const openModal = (type) => {
        setModalType(type);
        setFormData((prev) => ({
            ...prev,
            tipoRecuperacion: type === "parcial" ? "Recuperación Parcial" : "Recuperación Total",
        }));
        setSubmitted(false);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 9);
        setFormData({ ...formData, telefono: val });
    };

    const handleSubmit = () => {
        if (!formData.nombre || !formData.apellido || !formData.email || !formData.centro) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }
        if (formData.telefono && formData.telefono.length !== 9) {
            alert("El teléfono debe tener 9 dígitos.");
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="recu-page">
            <nav className="navbar-top">
                <div className="promo-container">
                    <div className="promo-track">
                        <span className="promo-text">
                            MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS • INSCRÍBETE HOY •
                            TENEMOS LOS MEJORES PRECIOS • LOS MEJORES PROFESORES • SACA TU CARNET A LA PRIMERA
                        </span>
                        <span className="promo-text">
                            • MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS • INSCRÍBETE HOY •
                            TENEMOS LOS MEJORES PRECIOS • LOS MEJORES PROFESORES • SACA TU CARNET A LA PRIMERA
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
                    <li><Link to="/cursos">Cursos</Link></li>
                    <li><Link to="/recuperacionPuntos">Recuperación de puntos</Link></li>
                    <li><Link to="/hacer-test">Hacer test</Link></li>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                </ul>
            </nav>

            <section className="recu-hero">
                <div className="recu-hero-overlay"></div>
                <div className="recu-hero-content">
                    <h1 className="recu-hero-title">RECUPERACIÓN<br />DE PUNTOS</h1>
                </div>
                <div className="recu-hero-wave">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            <section className="recu-tipos-section">
                <h2 className="recu-section-title">¿QUÉ TIPO DE RECUPERACIÓN NECESITAS?</h2>
                <div className="recu-tipos-grid">

                    <div className="recu-tipo-card recu-parcial">
                        <div className="recu-tipo-header">
                            <span className="recu-tipo-badge">MÁS POPULAR</span>
                            <h3>RECUPERACIÓN PARCIAL</h3>
                            <p className="recu-tipo-subtitle">Recupera hasta <strong>4 puntos</strong> en solo <strong>10 horas</strong></p>
                        </div>
                        <div className="recu-tipo-body">
                            <div className="recu-tipo-price-block">
                                <span className="recu-tipo-price">255€</span>
                            </div>
                            <ul className="recu-tipo-list">
                                <li><span className="recu-check">✔</span> Hasta 4 puntos recuperados</li>
                                <li><span className="recu-check">✔</span> Curso de 10 horas</li>
                                <li><span className="recu-check">✔</span> Modalidad presencial</li>
                                <li><span className="recu-check">✔</span> Cada 2 años (1 año profesionales)</li>
                            </ul>
                            <button className="recu-calendar-btn recu-parcial-btn" onClick={() => openModal("parcial")}>
                                <img src="/imagenes/calendario.png" alt="calendario" className="recu-calendar-icon-img" />
                                <span className="recu-calendar-btn-text">
                                    Ver calendario de cursos<br />y solicitar plaza
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="recu-tipo-card recu-total">
                        <div className="recu-tipo-header">
                            <span className="recu-tipo-badge recu-badge-orange">MÁXIMA RECUPERACIÓN</span>
                            <h3>RECUPERACIÓN TOTAL</h3>
                            <p className="recu-tipo-subtitle">Recupera hasta <strong>8 puntos</strong> en solo <strong>20 horas</strong></p>
                        </div>
                        <div className="recu-tipo-body">
                            <div className="recu-tipo-price-block">
                                <span className="recu-tipo-price">480€</span>
                            </div>
                            <ul className="recu-tipo-list">
                                <li><span className="recu-check">✔</span> Hasta 8 puntos recuperados</li>
                                <li><span className="recu-check">✔</span> Curso de 20 horas</li>
                                <li><span className="recu-check">✔</span> Modalidad presencial</li>
                                <li><span className="recu-check">✔</span> Examen final obligatorio</li>
                            </ul>
                            <button className="recu-calendar-btn recu-total-btn" onClick={() => openModal("total")}>
                                <img src="/imagenes/calendario.png" alt="calendario" className="recu-calendar-icon-img recu-calendar-icon-orange" />
                                <span className="recu-calendar-btn-text">
                                    Ver calendario de cursos<br />y solicitar plaza
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            <section className="recu-info-section">
                <h2 className="recu-section-title">INFORMACIÓN DEL CURSO</h2>
                <div className="recu-info-grid">
                    <div className="recu-info-card">
                        <h4>Requisitos</h4>
                        <p>Permiso de conducir en vigor y puntos disponibles o pérdida total.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Duración</h4>
                        <p>Curso parcial: 12 horas.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Modalidad</h4>
                        <p>Formación presencial en centros autorizados.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Certificación</h4>
                        <p>Certificado homologado por la DGT</p>
                    </div>
                </div>
            </section>

            <section className="recu-form-section" id="inscripcion">
                <h2 className="recu-section-title">FORMULARIO DE INSCRIPCIÓN</h2>
                <p className="recu-form-subtitle">Rellena el formulario y nos pondremos en contacto contigo para confirmar tu plaza</p>
                <div className="recu-form-wrapper">
                    <InscripcionForm sedes={sedes} />
                </div>
            </section>

            <section className="recu-faq-section">
                <h2 className="recu-section-title recu-faq-title">RESPUESTAS A PREGUNTAS FRECUENTES</h2>
                <div className="recu-faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`recu-faq-item ${openFaq === i ? "open" : ""}`}>
                            <button
                                className="recu-faq-question"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className="recu-faq-plus">{openFaq === i ? "-" : "+"}</span>
                                {faq.pregunta}
                            </button>
                            {openFaq === i && (
                                <div className="recu-faq-answer">{faq.respuesta}</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <SharedFooter scrollToTop={scrollToTop} />

            {/* Modal solicitar plaza */}
            {showModal && (
                <div className="recu-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="recu-modal" onClick={(e) => e.stopPropagation()}>

                        <button className="recu-modal-close" onClick={() => setShowModal(false)}>✕</button>

                        {!submitted ? (
                            <>
                                <h3 className="recu-modal-title">Solicitar Plaza</h3>
                                <p className="recu-modal-sub">
                                    {modalType === "parcial"
                                        ? "Recuperación Parcial — 255€ · 10 horas · hasta 4 puntos"
                                        : "Recuperación Total — 480€ · 20 horas · hasta 8 puntos"}
                                </p>
                                <div className="recu-modal-form">
                                    <div className="recu-modal-row">
                                        <div className="recu-modal-field">
                                            <label>Nombre *</label>
                                            <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" />
                                        </div>
                                        <div className="recu-modal-field">
                                            <label>Apellido *</label>
                                            <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Tu apellido" />
                                        </div>
                                    </div>
                                    <div className="recu-modal-row">
                                        <div className="recu-modal-field">
                                            <label>Correo electrónico *</label>
                                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
                                        </div>
                                        <div className="recu-modal-field">
                                            <label>Teléfono</label>
                                            <input
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handlePhoneChange}
                                                placeholder="+34 600 000 000"
                                                maxLength={9}
                                                inputMode="numeric"
                                            />
                                        </div>
                                    </div>
                                    <div className="recu-modal-field">
                                        <label>Centro *</label>
                                        <select name="centro" value={formData.centro} onChange={handleChange}>
                                            <option value="">Selecciona un centro</option>
                                            {sedes.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button className="recu-modal-submit" onClick={handleSubmit}>Enviar solicitud</button>
                                </div>
                            </>
                        ) : (
                            <div className="recu-modal-success">
                                <h3>¡Solicitud enviada!</h3>
                                <p>Nos pondremos en contacto contigo en menos de 24 horas para confirmar tu plaza en <strong>{formData.centro}</strong>.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function InscripcionForm({ sedes }) {
    const [form, setForm] = useState({
        nombre: "", apellido: "", email: "", telefono: "",
        centro: "", tipoRecuperacion: "",
    });
    const [sent, setSent] = useState(false);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePhone = (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 9);
        setForm({ ...form, telefono: val });
    };

    const submit = () => {
        if (!form.nombre || !form.apellido || !form.email || !form.centro || !form.tipoRecuperacion) {
            alert("rellena todos los campos obligatorios");
            return;
        }
        if (form.telefono && form.telefono.length !== 9) {
            alert("El teléfono debe tener 9 dígitos.");
            return;
        }
        setSent(true);
    };

    if (sent) return (
        <div className="recu-inline-success">
            <img className="check" src="/imagenes/check.png" alt="check" />
            <h3>¡Inscripción recibida!</h3>
            <p>Te contactaremos pronto para confirmar tu plaza.</p>
        </div>
    );

    return (
        <div className="recu-inline-form">
            <div className="recu-inline-row">
                <div className="recu-inline-field">
                    <label>Nombre *</label>
                    <input name="nombre" value={form.nombre} onChange={handle} placeholder="Tu nombre" />
                </div>
                <div className="recu-inline-field">
                    <label>Apellido *</label>
                    <input name="apellido" value={form.apellido} onChange={handle} placeholder="Tu apellido" />
                </div>
            </div>
            <div className="recu-inline-row">
                <div className="recu-inline-field">
                    <label>Correo electrónico *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="correo@ejemplo.com" />
                </div>
                <div className="recu-inline-field">
                    <label>Teléfono</label>
                    <input
                        name="telefono"
                        value={form.telefono}
                        onChange={handlePhone}
                        placeholder="+34 600 000 000"
                        maxLength={9}
                        inputMode="numeric"
                    />
                </div>
            </div>
            <div className="recu-inline-row">
                <div className="recu-inline-field">
                    <label>Centro *</label>
                    <select name="centro" value={form.centro} onChange={handle}>
                        <option value="">Selecciona un centro</option>
                        {sedes.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="recu-inline-field">
                    <label>Tipo de recuperación *</label>
                    <select name="tipoRecuperacion" value={form.tipoRecuperacion} onChange={handle}>
                        <option value="">Seleccionar</option>
                        <option value="Recuperación Parcial">Recuperación Parcial (10h · 4 pts · 255€)</option>
                        <option value="Recuperación Total">Recuperación Total (20h · 8 pts · 480€)</option>
                    </select>
                </div>
            </div>
            <button className="recu-inline-submit" onClick={submit}>Inscribirme</button>
        </div>
    );
}

export default RecuperacionPuntos;