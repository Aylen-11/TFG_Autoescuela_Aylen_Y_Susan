import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./HacerTest.css";
import logo from "/imagenes/footer.png";

export function SharedFooter({ scrollToTop }) {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo-section">
                    <img src={logo} alt="Logo Autoescuela Villarey" className="footer-logo" />
                </div>

                {/* Enlaces del mismo footer */}
                <div className="footer-links-section">
                    <h4 className="footer-title">Enlaces Rápidos</h4>
                    <ul className="footer-links">
                        <li><Link to="/" onClick={scrollToTop}>Inicio</Link></li>
                        <li><Link to="/cursos" onClick={scrollToTop}>Nuestros Cursos</Link></li>
                        <li><Link to="/" onClick={scrollToTop}>¿Qué Carnet Buscas?</Link></li>
                        <li><Link to="/recuperacionPuntos" onClick={scrollToTop}>Recuperación de Puntos</Link></li>
                        <li><a href="https://practicatest.com/tests" target="_blank" rel="noopener noreferrer">Test Online</a></li>
                    </ul>
                </div>

                {/* footer */}
                <div className="footer-contact-section">
                    <h4 className="footer-title">Contacto</h4>
                    <p>📧 info@autoescuelavillarey.com</p>
                    <p>📞 +34 91 123 45 67</p>
                    <p>📍 Calle Gran Vía, 45, Madrid</p>

                    <div className="footer-socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <img src="/imagenes/facebook.png" alt="Facebook" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <img src="/imagenes/instagram.png" alt="Instagram" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <img src="/imagenes/twitter.png" alt="Twitter" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <img src="/imagenes/youtube.png" alt="YouTube" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Autoescuela Villarey. Todos los derechos reservados por S-A.</p>
            </div>
        </footer>
    );
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Utilidad: parsea la respuesta de la IA 
// Acepta texto plano, bloques ```json ... ``` o un objeto ya parseado
function parseAIResponse(raw) {
    if (typeof raw === "object" && raw !== null) return raw;
    const cleaned = String(raw)
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
    return JSON.parse(cleaned);
}

//  Componente principal
export default function TestPage() {
    const [datos, setDatos] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [corregido, setCorregido] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [parseError, setParseError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [carnetSeleccionado, setCarnetSeleccionado] = useState(null); // null = pantalla selector

    // Spring Boot llama a Gemini y devuelve el JSON como texto plano
    const generarTest = useCallback(async (carnet) => {
        setCargando(true);
        setParseError(null);
        setDatos(null);
        setRespuestas({});
        setCorregido(false);
        setResultado(null);

        try {
            const response = await fetch("http://localhost:9002/api/gemini/examen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ carnet }),
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // Spring Boot devuelve response.text() entonces hay que parsearlo manualmente
            const textoRespuesta = await response.text();
            const parsed = parseAIResponse(textoRespuesta);
            setDatos(parsed);
        } catch (e) {
            setParseError("Error al generar el test: " + e.message);
        } finally {
            setCargando(false);
        }
    }, []);

    // Lógica del test 
    const seleccionar = (id, letra) => {
        if (corregido) return;
        setRespuestas((prev) => ({ ...prev, [id]: letra }));
    };

    const corregir = () => {
        if (!datos) return;
        let bien = 0, mal = 0, blank = 0;
        datos.preguntas.forEach((p) => {
            const elegida = respuestas[p.id];
            if (!elegida) blank++;
            else if (elegida === p.respuesta_correcta) bien++;
            else mal++;
        });
        const pct = Math.round((bien / datos.preguntas.length) * 100);
        setResultado({ bien, mal, blank, pct });
        setCorregido(true);
        setTimeout(() => {
            document.getElementById("resultado-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
    };

    const estadoOpcion = (p, letra) => {
        if (!corregido) return respuestas[p.id] === letra ? "op-seleccionada" : "";
        if (letra === p.respuesta_correcta) return "op-correcta";
        if (respuestas[p.id] === letra) return "op-incorrecta";
        return "op-normal-bloqueada";
    };

    const estadoCard = (p) => {
        if (!corregido) return "";
        if (!respuestas[p.id] || respuestas[p.id] !== p.respuesta_correcta) return "estado-incorrecta";
        return "estado-correcta";
    };

    const respondidas = Object.keys(respuestas).length;
    const total = datos?.preguntas?.length || 0;
    const pct_progreso = total > 0 ? Math.round((respondidas / total) * 100) : 0;

    // Render
    return (
        <>
            {/* NAV SUPERIOR */}
            <nav className="navbar-top">
                <div className="promo-container">
                    <div className="promo-track">
                        <span className="promo-text">
                            MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS •
                            INSCRÍBETE HOY • TENEMOS LOS MEJORES PRECIOS •&nbsp;
                        </span>
                        <span className="promo-text">
                            MATRÍCULAS ABIERTAS • CLASES PRÁCTICAS • APROBADOS GARANTIZADOS •
                            INSCRÍBETE HOY • TENEMOS LOS MEJORES PRECIOS •&nbsp;
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
                    <li><Link to="/cursos">Cursos</Link></li>
                    <li><Link to="/recuperacionPuntos">Recuperación de puntos</Link></li>
                    <li><Link to="/hacer-test">Hacer test</Link></li>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                </ul>
            </nav>

            {/* CONTENIDO */}
            <main className="page-content">

                {/* Estado: error */}
                {parseError && (
                    <div className="estado-vacio">
                        <h2>Algo salió mal</h2>
                        <p>{parseError}</p>
                        <button className="btn-corregir" style={{ marginTop: "1.5rem" }} onClick={() => { setParseError(null); setCarnetSeleccionado(null); }}>
                            VOLVER AL SELECTOR
                        </button>
                    </div>
                )}

                {/* Estado: selector de carnet */}
                {!datos && !parseError && !cargando && (
                    <div className="selector-wrap">
                        <div className="test-header">
                            <h1 className="test-title">¿Qué carnet quieres practicar?</h1>
                            <p className="test-subtitle">Selecciona el tipo y genera un test aleatorio de 10 preguntas.</p>
                        </div>
                        {/* Dentro del selector-wrap, sustituye las carnets-grid y el botón por: */}
                        <div className="ht-select-wrap">
                            <select
                                className="ht-dropdown"
                                value={carnetSeleccionado || ""}
                                onChange={(e) => setCarnetSeleccionado(e.target.value || null)}
                            >
                                <option value="">-- Elige un carnet --</option>
                                <option value="A">Carnet A · Motocicletas</option>
                                <option value="A1">Carnet A1 · Motocicletas ligeras</option>
                                <option value="A2">Carnet A2 · Motocicletas medias</option>
                                <option value="B">Carnet B · Turismos y furgonetas</option>
                                <option value="C">Carnet C · Camiones</option>
                                <option value="C1">Carnet C1 · Camiones medianos</option>
                                <option value="D">Carnet D · Autobuses</option>
                                <option value="D1">Carnet D1 · Minibuses</option>
                            </select>
                            <div className="ht-select-arrow">▾</div>
                        </div>
                        <button
                            className="btn-corregir"
                            style={{ marginTop: "1.5rem" }}
                            disabled={!carnetSeleccionado}
                            onClick={() => generarTest(carnetSeleccionado)}
                        >
                            {carnetSeleccionado ? `GENERAR TEST CARNET ${carnetSeleccionado}` : "SELECCIONA UN CARNET"}
                        </button>
                    </div>
                )}

                {/* Estado: cargando */}
                {cargando && (
                    <div className="estado-vacio">
                        <div className="spinner" />
                        <p style={{ marginTop: "1.25rem", color: "var(--texto-muted)" }}>
                            Generando preguntas...
                        </p>
                    </div>
                )}

                {/* Estado: test cargado */}
                {datos && !cargando && (
                    <>
                        <div className="test-header">
                            <div className="test-badge">
                                Carnet {datos.test_metadata?.tipo_carnet || "B"}
                            </div>
                            <h1 className="test-title">Test de conducción</h1>
                            <p className="test-subtitle">
                                {total} preguntas · Elige una opción por pregunta
                            </p>
                        </div>

                        {!corregido && (
                            <div className="progreso-wrap">
                                <div className="progreso-barra">
                                    <div className="progreso-fill" style={{ width: `${pct_progreso}%` }} />
                                </div>
                                <span className="progreso-texto">{respondidas}/{total}</span>
                            </div>
                        )}

                        {datos.preguntas.map((p, i) => (
                            <div key={p.id} className={`pregunta-card ${estadoCard(p)}`}>
                                <div className="pregunta-num">Pregunta {i + 1} de {total}</div>
                                <div className="pregunta-enunciado">{p.enunciado}</div>
                                <div className="opciones-lista">
                                    {Object.entries(p.opciones).map(([letra, texto]) => {
                                        const cls = estadoOpcion(p, letra);
                                        return (
                                            <div
                                                key={letra}
                                                className={`opcion-item ${cls}`}
                                                onClick={() => seleccionar(p.id, letra)}
                                            >
                                                <span className="opcion-letra">{letra.toUpperCase()}</span>
                                                <span className="opcion-texto">{texto}</span>
                                                {corregido && letra === p.respuesta_correcta && (
                                                    <span className="opcion-icono check">✓</span>
                                                )}
                                                {corregido && respuestas[p.id] === letra && letra !== p.respuesta_correcta && (
                                                    <span className="opcion-icono cross">✗</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {corregido && (
                                    <div className="explicacion-box">{p.explicacion}</div>
                                )}
                            </div>
                        ))}

                        <button
                            className="btn-corregir"
                            onClick={corregir}
                            disabled={corregido}
                        >
                            {corregido ? "TEST CORREGIDO" : "CORREGIR TEST"}
                        </button>

                        {resultado && (
                            <div className="resultado-card" id="resultado-section">
                                <div className="resultado-nota">
                                    {resultado.bien}/{total} — {resultado.pct}%
                                </div>
                                <div className="resultado-desc">
                                    {resultado.pct >= 90
                                        ? "¡Excelente! Estás listo para el examen."
                                        : resultado.pct >= 70
                                            ? "Bien, pero repasa los errores antes del examen."
                                            : "Sigue practicando, aún hay margen de mejora."}
                                </div>
                                <div className="resultado-barra">
                                    <div
                                        className="resultado-barra-fill"
                                        style={{
                                            width: `${resultado.pct}%`,
                                            background: resultado.pct >= 70 ? "#4ade80" : "#f87171",
                                        }}
                                    />
                                </div>
                                <div className="resultado-stats">
                                    <div className="r-stat">
                                        <div className="r-stat-num verde">{resultado.bien}</div>
                                        <div className="r-stat-label">Correctas</div>
                                    </div>
                                    <div className="r-stat">
                                        <div className="r-stat-num rojo">{resultado.mal}</div>
                                        <div className="r-stat-label">Incorrectas</div>
                                    </div>
                                    <div className="r-stat">
                                        <div className="r-stat-num gris">{resultado.blank}</div>
                                        <div className="r-stat-label">Sin responder</div>
                                    </div>
                                </div>
                                <button className="btn-reset" onClick={() => { setDatos(null); setCarnetSeleccionado(null); setResultado(null); setCorregido(false); setRespuestas({}); }}>
                                    Nuevo test
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            {/* footer */}
            <SharedFooter scrollToTop={scrollToTop} />
        </>
    );
}