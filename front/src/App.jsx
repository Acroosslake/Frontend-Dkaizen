import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Importante el portero
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Staff from './pages/Staff';
import Reservas from './pages/Reservas';
import Nosotros from './pages/Nosotros'; 
import Servicios from './pages/Servicios'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Routes>
      {/* 🟢 RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      {/* 🟡 RUTAS PROTEGIDAS PARA CLIENTES */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/reservas" element={<Reservas />} />
      </Route>

      {/* 🔴 RUTAS PROTEGIDAS PARA ADMINS */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/staff" element={<Staff />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<h1>404 - Te perdiste, fiera.</h1>} />
    </Routes>
  );
}

export default App;