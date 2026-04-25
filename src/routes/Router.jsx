import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Cursos from "../pages/Cursos";
import Recuperacion from "../pages/Recuperacion";
import HacerTest from "../pages/HacerTest";

// Admin
import DashboardAdmin from "../admin/DashboardAdmin";
// Alumno
import DashboardAlumno from "../alumno/DashboardAlumno";
// Profesor
import DashboardProfesor from "../profesor/DashboardProfesor";

// Errores
import Pagina404 from "../errores/Error404"; 

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<Cursos/>}/>
        <Route path="/recuperacionPuntos" element={<Recuperacion/>}/>
        <Route path="/hacer-test" element={<HacerTest />} />
        
        {/* Rutas Admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        {/* Rutas Alumno */}
        <Route path="/alumno/dashboard" element={<DashboardAlumno />} />
        {/* Rutas Profesor */}
        <Route path="/profesor/dashboard" element={<DashboardProfesor />} />

        {/* Rutas de error */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
