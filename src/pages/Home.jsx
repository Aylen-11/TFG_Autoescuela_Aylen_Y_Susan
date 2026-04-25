import { Link } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import logo from "/imagenes/footer.png";
import "./Home.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
            <li><Link to="/hacer-test" onClick={scrollToTop}>Hacer test</Link></li>
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
//nuestro homeeee
function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const MapSection = () => {
    const lugares = [
      {
        nombre: "Autoescuela Villarey - Centro",
        lat: 40.4168,
        lng: -3.7038,
        direccion: "Calle Gran Vía, 45, Madrid",
        telefono: "91 123 45 67",
        imagen: "/imagenes/pop1.png"
      },
      {
        nombre: "Autoescuela Villarey - Sur",
        lat: 40.4100,
        lng: -3.7100,
        direccion: "Avenida del Sur, 123, Madrid",
        telefono: "91 234 56 78",
        imagen: "/imagenes/pop2.jpeg"
      },
      {
        nombre: "Autoescuela Villarey - Este",
        lat: 40.4200,
        lng: -3.6900,
        direccion: "Calle del Este, 12, Madrid",
        telefono: "91 456 78 90",
        imagen: "/imagenes/pop1.png"
      },
      {
        nombre: "Autoescuela Villarey - Oeste",
        lat: 40.4150,
        lng: -3.7200,
        direccion: "Avenida del Oeste, 56, Madrid",
        telefono: "91 567 89 01",
        imagen: "/imagenes/pop2.jpeg"
      },
      {
        nombre: "Autoescuela Villarey - Chamartín",
        lat: 40.4668,
        lng: -3.6860,
        direccion: "Paseo de la Habana, 10, Madrid",
        telefono: "91 678 90 12",
        imagen: "/imagenes/pop1.png"
      },
      {
        nombre: "Autoescuela Villarey - Retiro",
        lat: 40.4155, lng: -3.6820,
        direccion: "Calle de Alcalá, 200, Madrid",
        telefono: "91 789 01 23",
        imagen: "/imagenes/pop2.jpeg"
      },
      {
        nombre: "Autoescuela Villarey - Moncloa",
        lat: 40.4400,
        lng: -3.7170,
        direccion: "Glorieta de Moncloa, 5, Madrid",
        telefono: "91 890 12 34",
        imagen: "/imagenes/pop1.png"
      },
      {
        nombre: "Autoescuela Villarey - Tribunal",
        lat: 40.4270,
        lng: -3.6830,
        direccion: "Calle Serrano, 50, Madrid",
        telefono: "91 901 23 45",
        imagen: "/imagenes/pop2.jpeg"
      },
      {
        nombre: "Autoescuela Villarey - Chamberí",
        lat: 40.4380,
        lng: -3.7010,
        direccion: "Calle de José Abascal, 30, Madrid",
        telefono: "91 012 34 56",
        imagen: "/imagenes/pop1.png"
      },
    ];

    const iconoPersonalizado = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    });

    return (
      <section className="map-section">
        <div className="map-header">
          <h2 className="map-title">NUESTRAS UBICACIONES</h2>
        </div>
        <div className="map-content-wrapper">
          <div className="locations-list">
            <h3 className="locations-title">Nuestras Sedes</h3>
            <div className="locations-scroll">
              {lugares.map((lugar, index) => (
                <div key={index} className="location-card">
                  <div className="location-info">
                    <h4 className="location-name">{lugar.nombre}</h4>
                    <img src={lugar.imagen} alt={lugar.nombre} className="location-image" />
                    <p className="location-address">📍 {lugar.direccion}</p>
                    <p className="location-phone">📞 {lugar.telefono}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="map-container-wrapper">
            <MapContainer center={[40.4168, -3.7038]} zoom={13} scrollWheelZoom={false} doubleClickZoom={true} style={{ height: "100%", width: "100%", borderRadius: "12px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              {lugares.map((lugar, i) => (
                <Marker key={i} position={[lugar.lat, lugar.lng]} icon={iconoPersonalizado}>
                  <Popup>
                    <img src={lugar.imagen} alt={lugar.nombre} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                    <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "900", color: "black", marginRight: "-49px" }}>{lugar.nombre}</h4>
                    <p style={{ fontFamily: "Poppins, sans-serif", color: "black" }}>📍 {lugar.direccion}</p>
                    <p style={{ fontFamily: "Poppins, sans-serif", color: "black" }}>📞 {lugar.telefono}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="home-container">
      {/*Navar tipo marquee color azul*/}
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

      {/* Nvar blanco con los links*/}
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

      {/*tipo insignias que aparecen con la imagen */}
      <section className="hero-home">
        <img src="/imagenes/cochehome.png" alt="Coche autoescuela" className="hero-background-img" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">APRENDE A CONDUCIR</h1>
          <p className="hero-subtitle">¡Sácate a la primera el carnet rápido y fácil!</p>
          <a href="#quebuscass" className="btn-hero">Más información</a>
        </div>
        <div className="info-badges">
          <div className="info-badge">
            <img src="/imagenes/documento.png" alt="Teórica" className="badge-icon" />
            <span className="badge-text">Teórica Intensiva</span>
          </div>
          <div className="info-badge">
            <img src="/imagenes/reloj1.png" alt="Horarios" className="badge-icon" />
            <span className="badge-text">Horarios Flexibles</span>
          </div>
          <div className="info-badge">
            <img src="/imagenes/barra-grafica.png" alt="Aprobados" className="badge-icon" />
            <span className="badge-text">Alto índice de aprobados</span>
          </div>
          <div className="info-badge">
            <img src="/imagenes/mano.png" alt="Estrellas" className="badge-icon" />
            <span className="badge-text">4,9/5 estrellas en Google</span>
          </div>
        </div>
      </section>

      <h1 id="quebuscass"></h1>
      <br />
      <h2 className="quebuscas1">¿QUÉ CARNET BUSCAS?</h2>

      {/* tarjetas de los carnets*/} 
      <section className="cards-section">
        {/* carnet A */}
        <div className="modern-card">
          <div className="card-pattern-grid"></div>
          <div className="bold-pattern">
            <svg viewBox="0 0 100 100"><path strokeDasharray="15 10" strokeWidth="10" stroke="#014495" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z"></path></svg>
          </div>
          <div className="card-title-area">
            <span>Carnet Tipo A</span>
            <span className="card-tag">Más Popular</span>
          </div>
          <div className="card-body">
            <div className="card-image-container">
              <img src="/imagenes/moto.png" alt="Carnet A" className="modern-card-image1" />
            </div>
            <div className="feature-grid">
              <div className="feature-item"><span className="feature-text">✓ Motocicletas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Con/sin sidecar</span></div>
              <div className="feature-item"><span className="feature-text">✓ Prácticas incluidas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Material teórico</span></div>
            </div>
            <div className="card-actions">
              <div className="price"><span className="price-currency">€</span>250<span className="price-period">curso completo</span></div>
              <Link to="/cursos?category=motos" onClick={scrollToTop} className="card-button">Inscribirse</Link>
            </div>
          </div>
          <div className="dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#014495" r="3" cy="10" cx="10"></circle><circle fill="#014495" r="3" cy="10" cx="30"></circle>
              <circle fill="#014495" r="3" cy="10" cx="50"></circle><circle fill="#014495" r="3" cy="10" cx="70"></circle>
              <circle fill="#014495" r="3" cy="20" cx="20"></circle><circle fill="#014495" r="3" cy="20" cx="40"></circle>
              <circle fill="#014495" r="3" cy="20" cx="60"></circle><circle fill="#014495" r="3" cy="30" cx="10"></circle>
              <circle fill="#014495" r="3" cy="30" cx="30"></circle><circle fill="#014495" r="3" cy="30" cx="50"></circle>
              <circle fill="#014495" r="3" cy="30" cx="70"></circle>
            </svg>
          </div>
          <div className="accent-shape"></div>
          <div className="corner-slice"></div>
        </div>

        {/* carnet B */}
        <div className="modern-card">
          <div className="card-pattern-grid"></div>
          <div className="bold-pattern">
            <svg viewBox="0 0 100 100"><path strokeDasharray="15 10" strokeWidth="10" stroke="#014495" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z"></path></svg>
          </div>
          <div className="card-title-area">
            <span>Carnet Tipo B</span>
            <span className="card-tag">Más vendido</span>
          </div>
          <div className="card-body">
            <div className="card-image-container">
              <img src="/imagenes/coche.png" alt="Carnet B" className="modern-card-image2" />
            </div>
            <div className="feature-grid">
              <div className="feature-item"><span className="feature-text">✓ Hasta 3.500 kg</span></div>
              <div className="feature-item"><span className="feature-text">✓ Hasta 9 plazas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Prácticas incluidas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Material teórico</span></div>
            </div>
            <div className="card-actions">
              <div className="price"><span className="price-currency">€</span>550<span className="price-period">curso completo</span></div>
              <Link to="/cursos?category=coches" onClick={scrollToTop} className="card-button">Inscribirse</Link>
            </div>
          </div>
          <div className="dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#014495" r="3" cy="10" cx="10"></circle><circle fill="#014495" r="3" cy="10" cx="30"></circle>
              <circle fill="#014495" r="3" cy="10" cx="50"></circle><circle fill="#014495" r="3" cy="10" cx="70"></circle>
              <circle fill="#014495" r="3" cy="20" cx="20"></circle><circle fill="#014495" r="3" cy="20" cx="40"></circle>
              <circle fill="#014495" r="3" cy="20" cx="60"></circle><circle fill="#014495" r="3" cy="30" cx="10"></circle>
              <circle fill="#014495" r="3" cy="30" cx="30"></circle><circle fill="#014495" r="3" cy="30" cx="50"></circle>
              <circle fill="#014495" r="3" cy="30" cx="70"></circle>
            </svg>
          </div>
          <div className="accent-shape"></div>
          <div className="corner-slice"></div>
        </div>

        {/* Carnet C */}
        <div className="modern-card">
          <div className="card-pattern-grid"></div>
          <div className="bold-pattern">
            <svg viewBox="0 0 100 100"><path strokeDasharray="15 10" strokeWidth="10" stroke="#014495" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z"></path></svg>
          </div>
          <div className="card-title-area">
            <span>Carnet Tipo C</span>
            <span className="card-tag">Profesional</span>
          </div>
          <div className="card-body">
            <div className="card-image-container">
              <img src="/imagenes/camion.png" alt="Carnet C" className="modern-card-image3" />
            </div>
            <div className="feature-grid">
              <div className="feature-item"><span className="feature-text">✓ Más de 3.500 kg</span></div>
              <div className="feature-item"><span className="feature-text">✓ Vehículos pesados</span></div>
              <div className="feature-item"><span className="feature-text">✓ Prácticas incluidas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Material teórico</span></div>
            </div>
            <div className="card-actions">
              <div className="price"><span className="price-currency">€</span>750<span className="price-period">curso completo</span></div>
              <Link to="/cursos?category=camiones" onClick={scrollToTop} className="card-button">Inscribirse</Link>
            </div>
          </div>
          <div className="dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#014495" r="3" cy="10" cx="10"></circle><circle fill="#014495" r="3" cy="10" cx="30"></circle>
              <circle fill="#014495" r="3" cy="10" cx="50"></circle><circle fill="#014495" r="3" cy="10" cx="70"></circle>
              <circle fill="#014495" r="3" cy="20" cx="20"></circle><circle fill="#014495" r="3" cy="20" cx="40"></circle>
              <circle fill="#014495" r="3" cy="20" cx="60"></circle><circle fill="#014495" r="3" cy="30" cx="10"></circle>
              <circle fill="#014495" r="3" cy="30" cx="30"></circle><circle fill="#014495" r="3" cy="30" cx="50"></circle>
              <circle fill="#014495" r="3" cy="30" cx="70"></circle>
            </svg>
          </div>
          <div className="accent-shape"></div>
          <div className="corner-slice"></div>
        </div>

        {/* carnet D */}
        <div className="modern-card">
          <div className="card-pattern-grid"></div>
          <div className="bold-pattern">
            <svg viewBox="0 0 100 100"><path strokeDasharray="15 10" strokeWidth="10" stroke="#014495" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z"></path></svg>
          </div>
          <div className="card-title-area">
            <span>Carnet Tipo D</span>
            <span className="card-tag">Profesional</span>
          </div>
          <div className="card-body">
            <div className="card-image-container">
              <img src="/imagenes/bus.png" alt="Carnet D" className="modern-card-image4" />
            </div>
            <div className="feature-grid">
              <div className="feature-item"><span className="feature-text">✓ Transporte pasajeros</span></div>
              <div className="feature-item"><span className="feature-text">✓ Autobuses</span></div>
              <div className="feature-item"><span className="feature-text">✓ Prácticas incluidas</span></div>
              <div className="feature-item"><span className="feature-text">✓ Material teórico</span></div>
            </div>
            <div className="card-actions">
              <div className="price"><span className="price-currency">€</span>850<span className="price-period">curso completo</span></div>
              <Link to="/cursos?category=autobuses" onClick={scrollToTop} className="card-button">Inscribirse</Link>
            </div>
          </div>
          <div className="dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#014495" r="3" cy="10" cx="10"></circle><circle fill="#014495" r="3" cy="10" cx="30"></circle>
              <circle fill="#014495" r="3" cy="10" cx="50"></circle><circle fill="#014495" r="3" cy="10" cx="70"></circle>
              <circle fill="#014495" r="3" cy="20" cx="20"></circle><circle fill="#014495" r="3" cy="20" cx="40"></circle>
              <circle fill="#014495" r="3" cy="20" cx="60"></circle><circle fill="#014495" r="3" cy="30" cx="10"></circle>
              <circle fill="#014495" r="3" cy="30" cx="30"></circle><circle fill="#014495" r="3" cy="30" cx="50"></circle>
              <circle fill="#014495" r="3" cy="30" cx="70"></circle>
            </svg>
          </div>
          <div className="accent-shape"></div>
          <div className="corner-slice"></div>
        </div>
      </section>

      <h2 className="quebuscas">DESCUBRE MÁS SOBRE NOSOTROS</h2>

      {/*sesccion de sobre niosotros como autoescuela */}
      <section className="about-section">
        <div className="about-hero">
          <div className="about-hero-left">
            <h2 className="about-hero-title">+500 Alumnos Formados</h2>
            <p className="about-hero-text">
              En Autoescuela Villarey nos apasiona ayudarte a cumplir tu meta de sacar el carnet de conducir
              de manera rápida, segura y confiable. Con más de 10 años de experiencia, hemos formado a
              cientos de conductores que hoy circulan con seguridad.
            </p>
          </div>
          <div className="about-hero-right">
            <h2 className="about-hero-title">+10 Años de Experiencia</h2>
            <p className="about-hero-text">
              Hemos formado conductores durante más de una década, perfeccionando nuestros métodos para
              que aprender sea rápido y seguro. Ofrecemos clases adaptadas a tu rutina, incluyendo mañanas,
              tardes y fines de semana.
            </p>
          </div>
        </div>
        <div className="about-content">
          <div className="about-content-wrapper">
            <div className="about-text-side">
              <span className="about-subtitle">Encuentranos como Autoescuela Villarey</span>
              <h3 className="about-main-title">Excelencia en Formación Vial</h3>
              <p className="about-description">
                Con más de 10 años de experiencia, somos la autoescuela de referencia en la zona.
                Nuestro equipo de profesionales certificados te acompañará en cada paso del camino,
                desde tu primera clase teórica hasta que obtengas tu carnet de conducir.
              </p>
            </div>
            <div className="about-images-side">
              <div className="about-image-wrapper">
                <img src="/imagenes/profe.png" alt="Clases prácticas" className="about-image" />
              </div>
              <div className="about-image-wrapper">
                <img src="/imagenes/coche.png" alt="Vehículos modernos" className="about-image" />
              </div>
              <div className="about-image-wrapper">
                <img src="/imagenes/escuela.png" alt="Instalaciones" className="about-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*consejos de como pasar el todo */}
      <section className="driving-tips-section">
        <div className="road-decoration road-top">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
        </div>
        <div className="tips-header">
          <h2 className="tips-main-title">CONSEJOS PARA APROBAR A LA PRIMERA</h2>
        </div>
        <p className="tips-subtitle">Sigue estos consejos de nuestros profesores expertos y aumenta tus posibilidades de éxito</p>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="card-road-stripes"></div>
            <h3 className="tip-title">Estudia Constantemente</h3>
            <p className="tip-description">Dedica al menos 30 minutos diarios a repasar las normas de tráfico. La constancia es clave para aprobar el examen teórico.</p>
            <div className="tip-footer"><span className="tip-tag">TEÓRICO</span></div>
          </div>
          <div className="tip-card">
            <div className="card-road-stripes"></div>
            <h3 className="tip-title">Practica Regularmente</h3>
            <p className="tip-description">Las clases prácticas deben ser frecuentes. Recomendamos al menos 2-3 clases por semana para mantener el ritmo de aprendizaje.</p>
            <div className="tip-footer"><span className="tip-tag">PRÁCTICO</span></div>
          </div>
          <div className="tip-card">
            <div className="card-road-stripes"></div>
            <h3 className="tip-title">Mantén la Calma</h3>
            <p className="tip-description">Los nervios son normales, pero aprende técnicas de relajación. Un conductor tranquilo es un conductor seguro.</p>
            <div className="tip-footer"><span className="tip-tag">MENTAL</span></div>
          </div>
        </div>
        <div className="road-decoration road-bottom">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
        </div>
      </section>

      <MapSection />
      <br /><br /><br />

      {/* nuestras reseñas  */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2 className="reviews-title">LO QUE DICEN NUESTROS ALUMNOS</h2>
          <p className="reviews-subtitle">Más de 500 alumnos satisfechos respaldan nuestra calidad de enseñanza</p>
        </div>
        <div className="reviews-container">
          {[
            { initial: "J", name: "Jose Acosta Batlle", time: "Hace 2 semanas", text: "La experiencia ha sido magnífica. Empezando por Patricia que rápidamente se dio cuenta de lo que necesitaba. Los profesores son muy profesionales y pacientes." },
            { initial: "M", name: "María González", time: "Hace 1 mes", text: "Increíble autoescuela, me aprobé a la primera tanto teórico como práctico. Los profesores son excelentes y muy atentos. Totalmente recomendable." },
            { initial: "C", name: "Carlos Rodríguez", time: "Hace 3 semanas", text: "Muy contento con el trato recibido. Las clases prácticas son muy completas y los horarios súper flexibles. Sin duda la mejor autoescuela de Madrid." },
            { initial: "L", name: "Laura Martínez", time: "Hace 2 meses", text: "Profesionales de primera. Me ayudaron muchísimo a superar mis miedos al volante. Aprobé el examen práctico sin problemas gracias a su paciencia." },
          ].map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-card-pattern"></div>
              <div className="review-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="review-text">{r.text}</p>
                <div className="review-author">
                  <div className="author-avatar">{r.initial}</div>
                  <div className="author-info">
                    <p className="author-name">{r.name}</p>
                    <p className="author-time">{r.time}</p>
                  </div>
                </div>
              </div>
              <div className="review-corner-accent"></div>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <SharedFooter scrollToTop={scrollToTop} />
    </div>
  );
}

export default Home;