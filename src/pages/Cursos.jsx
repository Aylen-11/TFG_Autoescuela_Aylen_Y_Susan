import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PagoPayPal from '../components/PagoPayPal';
import ShinyText from "./ShinyText";
import "./Cursos.css";

const PAQUETE_IDS = {
  "basico-motos":           1,
  "estandar-motos":         2,
  "completo-motos":         3,
  "basico-coches":          4,
  "estandar-coches":        5,
  "completo-coches":        6,
  "basico-camiones":        7,
  "estandar-camiones":      8,
  "completo-camiones":      9,
  "basico-autobuses":      10,
  "estandar-autobuses":    11,
  "completo-autobuses":    12,
  "basico-profesional":    13,
  "estandar-profesional":  14,
  "completo-profesional":  15,
};

function Cursos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCarnet, setSelectedCarnet] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [extraClass, setExtraClass] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const estaLogueado = !!localStorage.getItem("auth");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categorias = [
    { id: "motos",     name: "Moto",      icon: "/imagenes/motobtn.png"  },
    { id: "coches",    name: "Coche",     icon: "/imagenes/cochebtn.png" },
    { id: "camiones",  name: "Camiones",  icon: "/imagenes/camionbtn.png"},
    { id: "autobuses", name: "Autobuses", icon: "/imagenes/busbtn.png"   },
    { id: "cap",       name: "CAP",       icon: "/imagenes/CAPbtn.png"   }
  ];

  const allCarnets = [
    { id: "am",  category: "motos",     name: "Permiso AM para ciclomotor",                    icon: "/imagenes/AM.png",   courseId: "motos"      },
    { id: "a1",  category: "motos",     name: "Permiso A1 para motos hasta 125cc",              icon: "/imagenes/A1.png",   courseId: "motos"      },
    { id: "a2",  category: "motos",     name: "Permiso A2 para motos hasta 35kW",               icon: "/imagenes/A1.png",   courseId: "motos"      },
    { id: "a",   category: "motos",     name: "Permiso A para motos de cualquier cilindrada",   icon: "/imagenes/A.png",    courseId: "motos"      },
    { id: "b",   category: "coches",    name: "Permiso B para turismos",                        icon: "/imagenes/B.png",    courseId: "coches"     },
    { id: "be",  category: "coches",    name: "Permiso B+E para turismos con remolque",         icon: "/imagenes/B+E.png",  courseId: "coches"     },
    { id: "c",   category: "camiones",  name: "Permiso C para camiones",                        icon: "/imagenes/C.png",    courseId: "camiones"   },
    { id: "c1",  category: "camiones",  name: "Permiso C1 para camiones ligeros",               icon: "/imagenes/C1.png",   courseId: "camiones"   },
    { id: "c1e", category: "camiones",  name: "Permiso C1+E para camiones ligeros con remolque",icon: "/imagenes/C1+E.png", courseId: "camiones"   },
    { id: "ce",  category: "camiones",  name: "Permiso CE para camiones con remolque",          icon: "/imagenes/CE.png",   courseId: "camiones"   },
    { id: "d",   category: "autobuses", name: "Permiso D para autobuses",                       icon: "/imagenes/D.png",    courseId: "autobuses"  },
    { id: "de",  category: "autobuses", name: "Permiso D+E para autobuses con remolque",        icon: "/imagenes/D+E.png",  courseId: "autobuses"  },
    { id: "d1e", category: "autobuses", name: "Permiso D1+E para minibuses con remolque",       icon: "/imagenes/D1+E.png", courseId: "autobuses"  },
    { id: "cap", category: "cap",       name: "CAP - Certificado Aptitud Profesional",          icon: "/imagenes/CAP.png",  courseId: "profesional"}
  ];

  const permisosInfoMotos = {
    am: {
      badge: "Permiso AM",
      title: "-Información del Permiso AM",
      description: "El permiso AM es el carnet más básico de moto. Permite conducir ciclomotores pequeños, ideales para moverse por ciudad. Edad mínima: 15 años.",
      image: "/imagenes/Cursosmoto.png",
      imageClass: "permit-img-am",
      caracteristicas: [
        "Al aprobar te daremos la V-13 (L)",
        "Pruebas de test oficiales de la DGT",
        "Ciclomotores de última generación para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Maniobras básicas y circulación segura en ciudad"
      ]
    },
    a1: {
      badge: "Permiso A1",
      title: "-Información del Permiso A1",
      description: "El permiso A1 te permite conducir motocicletas de hasta 125cc y 15 CV de potencia. Ideal para iniciarte en el mundo de las motos. Edad mínima: 16 años.",
      image: "/imagenes/Cursosmotoa1.png",
      imageClass: "permit-img-a1",
      caracteristicas: [
        "Al aprobar te daremos la V-13 (L)",
        "Pruebas de test oficiales de la DGT",
        "Motos de 125cc de última generación para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Maniobras avanzadas y circulación segura en vías urbanas e interurbanas"
      ]
    },
    a2: {
      badge: "Permiso A2",
      title: "-Información del Permiso A2",
      description: "El permiso A2 te habilita para conducir motocicletas de hasta 35 kW (47 CV) de potencia. Perfecto para motos de cilindrada media. Edad mínima: 18 años.",
      image: "/imagenes/A2-info.png",
      imageClass: "permit-img-a2",
      caracteristicas: [
        "Al aprobar te daremos la V-13 (L)",
        "Pruebas de test oficiales de la DGT",
        "Motos de media cilindrada de última generación para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Maniobras profesionales y circulación en todo tipo de vías"
      ]
    },
    a: {
      badge: "Permiso A",
      title: "Información sobre Permiso A",
      description: "El permiso A es el carnet definitivo que te permite conducir cualquier motocicleta sin restricciones de potencia o cilindrada. Edad mínima: 20 años (con A2 previo) o 24 años.",
      image: "/imagenes/A-info.png",
      imageClass: "permit-img-a",
      caracteristicas: [
        "Al aprobar te daremos la V-13 (L)",
        "Pruebas de test oficiales de la DGT",
        "Motos de alta cilindrada de última generación para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Superar el test psicotécnico en un centro médico autorizado"
      ]
    }
  };

  const permisosInfoCoches = {
    b: {
      badge: "Permiso B",
      title: "Información sobre Permiso B",
      description: "El permiso B te permite conducir turismos y vehículos de hasta 3.500 kg. Es el carnet más común y versátil. Edad mínima: 18 años.",
      image: "/imagenes/coche.png",
      imageClass: "permit-img-b",
      caracteristicas: [
        "Al aprobar te daremos la V-13 (L)",
        "Pruebas de test oficiales de la DGT",
        "Vehículos modernos para tu aprendizaje",
        "Superar con éxito el examen práctico de circulación",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Formación completa en circulación urbana e interurbana"
      ]
    },
    be: {
      badge: "Permiso B+E",
      title: "Información del Permiso B+E",
      description: "El permiso B+E te habilita para conducir turismos con remolques de más de 750 kg. Ideal para caravanas y remolques pesados. Requiere tener el permiso B.",
      image: "/imagenes/BE-info.png",
      imageClass: "permit-img-be",
      caracteristicas: [
        "Permiso B previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Práctica con vehículos y remolques reales",
        "Superar con éxito el examen práctico de maniobras",
        "Maniobras específicas con remolque",
        "Formación en marcha atrás y estacionamiento con remolque"
      ]
    }
  };

  const permisosInfoCamiones = {
    c: {
      badge: "Permiso C",
      title: "Información sobre Permiso C",
      description: "El permiso C te permite conducir camiones de más de 3.500 kg. Formación profesional completa. Edad mínima: 21 años (18 con CAP).",
      image: "/imagenes/C-info.png",
      imageClass: "permit-img-c",
      caracteristicas: [
        "Permiso B previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Práctica con camiones profesionales",
        "Superar con éxito el examen práctico de circulación",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Formación profesional especializada"
      ]
    },
    c1: {
      badge: "Permiso C1",
      title: "-Información del Permiso C1",
      description: "El permiso C1 te habilita para conducir camiones ligeros de entre 3.500 y 7.500 kg. Perfecto para transporte ligero. Edad mínima: 18 años.",
      image: "/imagenes/C1-info.png",
      imageClass: "permit-img-c1",
      caracteristicas: [
        "Permiso B previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Camiones ligeros para tu aprendizaje",
        "Superar con éxito el examen práctico",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Formación en conducción de vehículos pesados"
      ]
    },
    c1e: {
      badge: "Permiso C1+E",
      title: "Información del Permiso C1+E",
      description: "El permiso C1+E te permite conducir camiones ligeros con remolque. Ideal para transporte profesional con remolques. Requiere permiso C1.",
      image: "/imagenes/C1E-info.png",
      imageClass: "permit-img-c1e",
      caracteristicas: [
        "Permiso C1 previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Práctica con remolques profesionales",
        "Superar con éxito el examen práctico de maniobras",
        "Maniobras específicas con remolque",
        "Formación profesional especializada"
      ]
    },
    ce: {
      badge: "Permiso CE",
      title: "-Información del Permiso CE",
      description: "El permiso CE es el más completo para camiones, permitiendo conducir cualquier camión con remolque. Formación profesional de élite. Requiere permiso C.",
      image: "/imagenes/CE-info.png",
      imageClass: "permit-img-ce",
      caracteristicas: [
        "Permiso C previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Camiones articulados para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Maniobras complejas con remolque",
        "Máximo nivel de formación profesional"
      ]
    }
  };

  const permisosInfoAutobuses = {
    d: {
      badge: "Permiso D",
      title: "Información sobre Permiso D",
      description: "El permiso D te permite conducir autobuses de más de 9 plazas. Formación profesional para transporte de pasajeros. Edad mínima: 24 años (21 con CAP).",
      image: "/imagenes/D-info.png",
      imageClass: "permit-img-d",
      caracteristicas: [
        "Permiso B previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Autobuses profesionales para tu aprendizaje",
        "Superar con éxito el examen práctico de circulación",
        "Superar el test psicotécnico en un centro médico autorizado",
        "Formación especializada en transporte de pasajeros"
      ]
    },
    de: {
      badge: "Permiso D+E",
      title: "Información del Permiso D+E",
      description: "El permiso D+E te habilita para conducir autobuses con remolque de más de 750 kg. Máximo nivel profesional. Requiere permiso D.",
      image: "/imagenes/DE-info.png",
      imageClass: "permit-img-de",
      caracteristicas: [
        "Permiso D previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Autobuses articulados para tu aprendizaje",
        "Superar con éxito el examen práctico de maniobras",
        "Maniobras específicas con remolque",
        "Formación profesional de alto nivel"
      ]
    },
    d1e: {
      badge: "Permiso D1+E",
      title: "Información del Permiso D1+E",
      description: "El permiso D1+E te permite conducir minibuses con remolque. Ideal para transporte escolar y turístico con remolque. Requiere permiso D1.",
      image: "/imagenes/D1E-info.png",
      imageClass: "permit-img-d1e",
      caracteristicas: [
        "Permiso D1 previo obligatorio",
        "Pruebas de test oficiales de la DGT",
        "Minibuses con remolque para tu aprendizaje",
        "Superar con éxito el examen práctico",
        "Maniobras con remolque",
        "Formación profesional especializada"
      ]
    }
  };

  const permisosInfoCAP = {
    cap: {
      badge: "CAP",
      title: "-Información del CAP",
      description: "El Certificado de Aptitud Profesional es obligatorio para conductores profesionales de mercancías y viajeros. Formación continua y actualización profesional.",
      image: "/imagenes/cap.webp",
      imageClass: "permit-img-cap",
      caracteristicas: [
        "140 horas de formación inicial",
        "Cursos de actualización cada 5 años",
        "Simulador de conducción profesional",
        "Certificación oficial de la DGT",
        "Válido en toda la Unión Europea",
        "Formación en seguridad vial y primeros auxilios"
      ]
    }
  };

  const cursosData = {
    coches: {
      name: "Permiso B - Coche",
      image: "/imagenes/CB.png",
      description: "Edad mínima: 18 años. Empieza con el curso teórico hasta 3 meses antes de tu cumpleaños.",
      info: [
        "Examen teórico común (excepto si ya tienes el permiso de moto A1 o A2)",
        "Examen de circulación en vías abiertas al tráfico",
        "Prepárate con Go! Training System"
      ],
      permisos: ["B", "B+E"],
      paquetes: [
        {
          id: "basico",
          name: "Paquete Básico",
          subtitle: "Matrícula + 10 clases",
          price: 300,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "estandar",
          name: "Paquete Estándar",
          subtitle: "Matrícula + 20 clases",
          price: 500,
          popular: true,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "20 clases prácticas de 45 minutos", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "completo",
          name: "Paquete Completo",
          subtitle: "Matrícula + 30 clases + 1 clase especial",
          price: 800,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "30 clases prácticas de 45 minutos", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente", "Garantía de aprobado"]
        }
      ]
    },
    motos: {
      name: "Permisos de Moto",
      image: "/imagenes/A1.png",
      description: "El permiso AM es el carnet más básico de moto. Permite conducir ciclomotores pequeños. Edad mínima: 15 años.",
      info: [
        "Al aprobar te daremos la V-13 (L).",
        "Pruebas de test oficiales de la DGT",
        "Motos de última generación para tu aprendizaje"
      ],
      permisos: ["AM", "A1", "A2", "A"],
      paquetes: [
        {
          id: "basico",
          name: "Paquete Básico",
          subtitle: "Incluye la matrícula + 10 clases",
          price: 250,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "Material didáctico específico moto", "Test online oficiales DGT", "Formación personalizada"]
        },
        {
          id: "estandar",
          name: "Paquete Estándar",
          subtitle: "Matrícula + 20 clases",
          price: 450,
          popular: true,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "8 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "completo",
          name: "Paquete Completo",
          subtitle: "Matrícula + 30 clases + 1 clase especial",
          price: 700,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "15 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente", "Seguro incluido"]
        }
      ]
    },
    camiones: {
      name: "Permisos de Camión",
      image: "/imagenes/CC.png",
      description: "Permisos profesionales para conducir vehículos pesados. Formación completa y práctica.",
      info: ["Formación profesional especializada", "Prácticas con camiones reales", "Preparación para examen teórico y práctico"],
      permisos: ["C", "C1", "C1+E", "CE"],
      paquetes: [
        {
          id: "basico",
          name: "Paquete Básico",
          subtitle: "Matrícula + 10 clases",
          price: 1000,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "Material didáctico profesional", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "estandar",
          name: "Paquete Estándar",
          subtitle: "Matrícula + 20 clases",
          price: 2000,
          popular: true,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "12 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "completo",
          name: "Paquete Completo",
          subtitle: "Matrícula + 30 clases + 1 clase especial",
          price: 3000,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "20 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente", "Bolsa de empleo"]
        }
      ]
    },
    autobuses: {
      name: "Permisos de Autobús",
      image: "/imagenes/D.png",
      description: "Permisos profesionales para transporte de pasajeros. Fórmate como conductor profesional.",
      info: ["Formación profesional especializada", "Prácticas con autobuses reales", "Preparación completa para exámenes"],
      permisos: ["D", "D+E", "D1+E"],
      paquetes: [
        {
          id: "basico",
          name: "Paquete Básico",
          subtitle: "Matrícula + 10 clases",
          price: 950,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "Material didáctico profesional", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "estandar",
          name: "Paquete Estándar",
          subtitle: "Matrícula + 20 clases",
          price: 1350,
          popular: true,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "15 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente"]
        },
        {
          id: "completo",
          name: "Paquete Completo",
          subtitle: "Matrícula + 30 clases + 1 clase especial",
          price: 1750,
          image: "/imagenes/paquetegeneral.png",
          includes: ["Matrícula", "25 clases prácticas", "1 examen práctico incluido", "Material didáctico completo", "Test online oficiales DGT", "Tramitación de expediente", "Bolsa de empleo exclusiva"]
        }
      ]
    },
    profesional: {
      name: "CAP - Certificado Aptitud Profesional",
      image: "/imagenes/CAP.png",
      description: "Certificación obligatoria para conductores profesionales de mercancías y viajeros.",
      info: ["140 horas de formación obligatoria", "Simulador de conducción avanzada", "Certificación oficial"],
      permisos: ["CAP"],
      paquetes: [
        {
          id: "basico",
          name: "CAP Básico",
          subtitle: "Formación completa 140h",
          price: 650,
          image: "/imagenes/paquete-basico-cap.png",
          includes: ["140 horas de formación", "Material didáctico completo", "Examen incluido", "Tramitación certificado"]
        },
        {
          id: "estandar",
          name: "CAP Estándar",
          subtitle: "Renovación 35h",
          price: 280,
          popular: true,
          image: "/imagenes/paquete-estandar-cap.png",
          includes: ["35 horas de formación", "Material didáctico", "Certificado de renovación", "Tramitación de expediente"]
        },
        {
          id: "completo",
          name: "CAP Completo",
          subtitle: "Formación + Bolsa empleo",
          price: 800,
          image: "/imagenes/paquete-completo-cap.png",
          includes: ["140 horas de formación", "Material didáctico completo", "Simulador avanzado", "Bolsa de empleo exclusiva", "Seguimiento personalizado", "Tramitación certificado"]
        }
      ]
    }
  };

  const addToCart = (item) => {
    const cartItem = {
      id: Date.now(),
      category: selectedCategory,
      courseName: cursosData[selectedCourse].name,
      package: item,
      paqueteKey: `${item.id}-${selectedCourse}`,  // ← clave para PAQUETE_IDS
      extraClass: extraClass,
      total: item.price + (extraClass ? 25 : 0)
    };
    setCart([...cart, cartItem]);
    alert("Paquete añadido al carrito");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const buyNow = (item) => {
    addToCart(item);
    setShowCart(true);
  };

  const getTotalCart = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getFilteredCarnets = () => {
    if (!selectedCategory) return allCarnets;
    return allCarnets.filter(carnet => carnet.category === selectedCategory);
  };

  const handleCarnetClick = (carnet) => {
    setSelectedCourse(carnet.courseId);
    setSelectedCarnet(carnet.id);
  };

  const resetCategory = () => {
    setSelectedCategory(null);
  };

  const getPermisoInfo = () => {
    if (selectedCourse === "motos"      && selectedCarnet && permisosInfoMotos[selectedCarnet])    return permisosInfoMotos[selectedCarnet];
    if (selectedCourse === "coches"     && selectedCarnet && permisosInfoCoches[selectedCarnet])   return permisosInfoCoches[selectedCarnet];
    if (selectedCourse === "camiones"   && selectedCarnet && permisosInfoCamiones[selectedCarnet]) return permisosInfoCamiones[selectedCarnet];
    if (selectedCourse === "autobuses"  && selectedCarnet && permisosInfoAutobuses[selectedCarnet])return permisosInfoAutobuses[selectedCarnet];
    if (selectedCourse === "profesional"&& selectedCarnet && permisosInfoCAP[selectedCarnet])      return permisosInfoCAP[selectedCarnet];
    return null;
  };

  const handleCompraCompletada = () => {
    setShowSuccessPopup(true);
    setCart([]);
  };

  const Navbar = () => (
    <>
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
          <li><Link to="/" onClick={scrollToTop}>Inicio</Link></li>
          <li><Link to="/recuperacionPuntos">Recuperación de puntos</Link></li>
          <li><a href="https://practicatest.com/tests" target="_blank" rel="noopener noreferrer">Hacer Test</a></li>
          <li><Link to="/login">Iniciar Sesión</Link></li>
          <li className="cart-icon" onClick={() => setShowCart(true)}>
            <img src="/imagenes/carrito.png" alt="Carrito" className="cart-image" />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </li>
        </ul>
      </nav>
    </>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <img src="/imagenes/footer.png" alt="Logo Autoescuela Villarey" className="footer-logo" />
        </div>
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
        <div className="footer-contact-section">
          <h4 className="footer-title">Contacto</h4>
          <p>📧 info@autoescuelavillarey.com</p>
          <p>📞 +34 91 123 45 67</p>
          <p>📍 Calle Gran Vía, 45, Madrid</p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="/imagenes/facebook.png" alt="Facebook" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="/imagenes/instagram.png" alt="Instagram" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src="/imagenes/twitter.png" alt="Twitter" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="/imagenes/youtube.png" alt="YouTube" /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Autoescuela Villarey. Todos los derechos reservados por S-A.</p>
      </div>
    </footer>
  );

  const SuccessPopup = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '60px 50px',
        maxWidth: '500px', width: '90%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '5px solid #032856',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#014495', fontFamily: 'Poppins, sans-serif', marginBottom: '15px' }}>
          ¡Compra realizada!
        </h2>
        <p style={{ fontSize: '18px', color: '#423e3e', fontFamily: 'Poppins, sans-serif', marginBottom: '10px', lineHeight: '1.6' }}>
          Tu matrícula ha sido procesada correctamente. Bienvenido a Autoescuela Villarey
        </p>
        <p style={{ fontSize: '15px', color: '#4c4242', fontFamily: 'Poppins, sans-serif', marginBottom: '35px' }}>
          Recibirás un correo con todos los detalles de tu curso.
        </p>
        <button
          onClick={() => { setShowSuccessPopup(false); setShowCart(false); navigate('/'); }}
          style={{
            backgroundColor: '#014495', color: 'white', border: 'none',
            borderRadius: '14px', padding: '16px 40px', fontSize: '17px',
            fontWeight: '800', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  // ── VISTA CARRITO ──────────────────────────────────────────────
  if (showCart) {
    return (
      <div className="cursos-container">
        {showSuccessPopup && <SuccessPopup />}
        <Navbar />
        <div className="cart-page">
          <button className="back-button" onClick={() => setShowCart(false)}>← Seguir comprando</button>
          <h1>Tu carrito</h1>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <button onClick={() => setShowCart(false)} className="btn-primary">Ver cursos</button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h3>{item.courseName}</h3>
                      <p className="package-name">{item.package.name}</p>
                      <p className="package-subtitle">{item.package.subtitle}</p>
                      {item.extraClass && <p className="extra-class-label">+ Clase especial extra</p>}
                    </div>
                    <div className="cart-item-actions">
                      <p className="cart-item-price">{item.total}€</p>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Detalles de tu compra</h2>
                <div className="summary-row"><span>Subtotal</span><span>{getTotalCart()}€</span></div>
                <div className="summary-row total"><span>TOTAL</span><span>{getTotalCart()}€</span></div>

                {!estaLogueado ? (
                  <>
                    <button className="checkout-btn" onClick={() => navigate('/login')}>
                      Iniciar sesión para pagar
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#747171', marginTop: '10px' }}>
                      Debes iniciar sesión para completar la compra
                    </p>
                  </>
                ) : (
                  <>
                    {showSuccessPopup ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '50px' }}></div>
                        <h3 style={{ color: '#014495', fontFamily: 'Poppins', marginTop: '10px' }}>¡Pago completado!</h3>
                        <p style={{ color: '#555', fontSize: '14px', margin: '10px 0 20px' }}>
                          Tu matrícula ha sido procesada correctamente.
                        </p>
                        <button className="checkout-btn"
                          onClick={() => { setShowSuccessPopup(false); setShowCart(false); navigate('/'); }}>
                          Volver al inicio
                        </button>
                      </div>
                    ) : (
                      // ✅ PagoPayPal con las props correctas
                      <PagoPayPal
                        precio={getTotalCart()}
                        idPaquete={PAQUETE_IDS[cart[0]?.paqueteKey] ?? 1}
                        onPagoExitoso={() => {
                          setShowSuccessPopup(true);
                          setCart([]);
                        }}
                        onPagoError={(msg) => alert('Error en el pago: ' + msg)}
                      />
                    )}
                  </>
                )}
                <p className="secure-payment">Pago 100% seguro con Autoescuela Villarey</p>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ── VISTA DETALLE PAQUETE ──────────────────────────────────────
  if (selectedPackage && selectedCourse) {
    const courseData = cursosData[selectedCourse];
    const packageData = courseData.paquetes.find(p => p.id === selectedPackage);
    const permisoInfo = getPermisoInfo();
    const carnetBadge = permisoInfo ? permisoInfo.badge : courseData.name;

    return (
      <div className="cursos-container">
        <Navbar />
        <div className="package-detail-page">
          <button className="back-button" onClick={() => setSelectedPackage(null)}>← Volver a paquetes</button>
          <div className="pd-product-card">
            {packageData.popular && <div className="pd-popular-ribbon">MÁS POPULAR</div>}
            <div className="pd-left-col">
              <div className="pd-image-gallery">
                <div className="pd-main-image">
                  <img src={packageData.image} alt={packageData.name} />
                </div>
              </div>
            </div>
            <div className="pd-right-col">
              <div className="pd-breadcrumb">
                <span className="pd-carnet-tag">{carnetBadge}</span>
              </div>
              <h1 className="pd-package-name">{packageData.name}</h1>
              <p className="pd-package-subtitle">{packageData.subtitle}</p>
              <div className="pd-price-row">
                <span className="pd-price">{packageData.price}€</span>
              </div>
              <div className="pd-divider" />
              <div className="pd-includes-section">
                <h3 className="pd-includes-title">¿Qué incluye?</h3>
                <ul className="pd-includes-list">
                  {packageData.includes.map((item, index) => (
                    <li key={index} className="pd-include-item">
                      <span className="pd-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pd-divider" />
              <div className="pd-extra-class-row">
                <label className="pd-extra-label">
                  <input type="checkbox" checked={extraClass} onChange={(e) => setExtraClass(e.target.checked)} />
                  <div className="pd-extra-text">
                    <span className="pd-extra-title">Añadir clase especial extra</span>
                    <span className="pd-extra-desc">45 minutos de simulacro de examen con examinador</span>
                  </div>
                  <span className="pd-extra-price">+25€</span>
                </label>
              </div>
              <div className="pd-total-row">
                <span className="pd-total-label">Total</span>
                <span className="pd-total-value">{packageData.price + (extraClass ? 25 : 0)}€</span>
              </div>
              <div className="pd-action-buttons">
                <button className="pd-btn-cart" onClick={() => addToCart(packageData)}>Añadir al carrito</button>
                <button className="pd-btn-buy" onClick={() => buyNow(packageData)}>Comprar ahora</button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── VISTA DETALLE CURSO ────────────────────────────────────────
  if (selectedCourse) {
    const courseData = cursosData[selectedCourse];
    const permisoInfo = getPermisoInfo();
    return (
      <div className="cursos-container">
        <Navbar />
        <div className="course-detail-page">
          <button className="back-button" onClick={() => { setSelectedCourse(null); setSelectedCarnet(null); }}>
            ← Volver a categorías
          </button>
          <div className="permit-info-section">
            <div className="permit-info-content">
              <div className="permit-info-left">
                <div className="permit-badge">{permisoInfo ? permisoInfo.badge : courseData.name}</div>
                <h2 className="permit-title">{permisoInfo ? permisoInfo.title : `Información del ${courseData.name}`}</h2>
                <p className="permit-description">{permisoInfo ? permisoInfo.description : courseData.description}</p>
                <div className="requirements-list">
                  <h3>Requisitos y características:</h3>
                  <ul>
                    {(permisoInfo ? permisoInfo.caracteristicas : courseData.info).map((item, index) => (
                      <li key={index}><span className="check-mark">✓</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="permit-info-right">
                <div className={`permit-image-wrapper ${permisoInfo ? permisoInfo.imageClass : ''}`}>
                  <img src={permisoInfo ? permisoInfo.image : courseData.image} alt="Imagen del permiso" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="packages-title">
            <ShinyText
              text="Matricúlate con nosotros y elige el pack que más se adapte a tus necesidades"
              speed={3} delay={0} color="#1e293b" shineColor="#3e5fb1"
              spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false}
            />
          </h2>

          <div className="packages-grid">
            {courseData.paquetes.map((paquete) => (
              <div key={paquete.id} className={`package-card ${paquete.popular ? 'popular' : ''}`}>
                {paquete.popular && <div className="popular-badge">MÁS POPULAR</div>}
                <h3>{paquete.name}</h3>
                <p className="package-subtitle">{paquete.subtitle}</p>
                <p className="package-price">{paquete.price}€</p>
                <button className="package-btn" onClick={() => setSelectedPackage(paquete.id)}>¿Qué incluye?</button>
              </div>
            ))}
          </div>

          <div className="special-lesson-container">
            <div className="lesson-details-wrapper">
              <div className="lesson-image-section">
                <div className="image-wrapper">
                  <img src="/imagenes/especial.png" alt="Clase especial" />
                </div>
              </div>
              <div className="lesson-text-section">
                <h1>Potencia tu aprendizaje</h1>
                <p className="lesson-description">Simulador de Examen Real</p>
                <p className="lesson-subdescription">45 minutos de conducción con evaluación examinador y feedback inmediato.</p>
              </div>
              <div className="lesson-price-section">
                <p className="lesson-price">25€</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── VISTA PRINCIPAL ────────────────────────────────────────────
  return (
    <div className="cursos-container">
      <Navbar />
      <div className="main-page">
        <div className="hero-minimal">
          <h1 id="frontend" className="main-title">Cursos y paquetes</h1>
        </div>
        <div className="category-filter-section">
          <div className="filter-buttons">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className={`filter-btn ${selectedCategory === categoria.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(categoria.id)}
              >
                <img src={categoria.icon} alt={categoria.name} />
                <span>{categoria.name}</span>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <button className="reset-filter" onClick={resetCategory}>Reiniciar ✕</button>
          )}
        </div>
        <div className="carnets-grid">
          {getFilteredCarnets().map((carnet) => (
            <div key={carnet.id} className="carnet-card">
              <div className="carnet-icon-container">
                <img src={carnet.icon} alt={carnet.name} />
              </div>
              <h3>{carnet.name}</h3>
              <button className="carnet-btn" onClick={() => handleCarnetClick(carnet)}>Ver detalles</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cursos;