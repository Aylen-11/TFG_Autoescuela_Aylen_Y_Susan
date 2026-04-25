import { Link } from "react-router-dom";
import { useState } from "react";
import { SharedFooter } from "./Home";
import "./Recuperacion.css";

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

function Recuperacion() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const [openFaq, setOpenFaq] = useState(null);

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

            {/* ── Hero ── */}
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

            {/* ── Tarjetas de tipo ── */}
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
                            <Link
                                to="/cursos?category=recuperacion"
                                className="recu-calendar-btn recu-parcial-btn"
                                style={{ textDecoration: 'none', justifyContent: 'center' }}
                            >
                                <span className="recu-calendar-btn-text">Ver más detalles</span>
                            </Link>
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
                            <Link
                                to="/cursos?category=recuperacion"
                                className="recu-calendar-btn recu-total-btn"
                                style={{ textDecoration: 'none', justifyContent: 'center' }}
                            >
                                <span className="recu-calendar-btn-text">Ver más detalles</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── Info del curso ── */}
            <section className="recu-info-section">
                <h2 className="recu-section-title">INFORMACIÓN DEL CURSO</h2>
                <div className="recu-info-grid">
                    <div className="recu-info-card">
                        <h4>Requisitos</h4>
                        <p>Permiso de conducir en vigor y puntos disponibles o pérdida total.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Duración</h4>
                        <p>Curso parcial: 10 horas. Curso total: 20 horas.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Modalidad</h4>
                        <p>Formación presencial en centros autorizados.</p>
                    </div>
                    <div className="recu-info-card">
                        <h4>Certificación</h4>
                        <p>Certificado homologado por la DGT.</p>
                    </div>
                </div>
            </section>

            {/* ── FAQs ── */}
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
        </div>
    );
}

export default Recuperacion;
