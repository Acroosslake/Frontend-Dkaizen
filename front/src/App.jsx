import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Staff from './pages/Staff';
import Reservas from './pages/Reservas';
// Quitamos Nosotros de aquí porque ya vive en el Home
import Servicios from './pages/Servicios'; 
import Perfil from './pages/Perfil'; // 👈 ¡ESTA ERA LA QUE FALTABA!
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Routes>
      {/* 🟢 RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      {/* 🔵 RUTA DE PERFIL (Protegida para ambos roles: admin y client) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'client']} />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* 🟡 RUTAS PROTEGIDAS SOLO PARA CLIENTES */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/reservas" element={<Reservas />} />
      </Route>

      {/* 🔴 RUTAS PROTEGIDAS SOLO PARA ADMINS */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/staff" element={<Staff />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen bg-dk-dark flex items-center justify-center">
          <h1 className="text-dk-gold font-vogue text-4xl">manito nos perdimos, por aqui no es :c</h1>
        </div>
      } />
    </Routes>
  );
}

export default App;