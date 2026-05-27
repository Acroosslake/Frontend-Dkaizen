import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Staff from './pages/Staff';
import Reservas from './pages/Reservas';
import Users from './pages/Users';
import Servicios from './pages/Servicios'; 
import GestionServicios from './pages/GestionServicios';
import Inventory from './pages/Inventory'; 
import Perfil from './pages/Perfil'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import BarberDashboard from './pages/BarberDashboard'; 

function App() {
  return (
    <Routes>
      {/* 🟢 RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      
      {/* 🔵 RUTA DE PERFIL (Protegida paratodos los roles) */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'client', 'barber']} />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* 🟡 RUTAS PROTEGIDAS SOLO PARA CLIENTES */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/reservas" element={<Reservas />} />
      </Route>

      {/* 🟠 RUTA DEL DASHBOARD DEL BARBER (Protegida para barberos) */ }
      <Route element={<ProtectedRoute allowedRoles={['barber']} />}>
        <Route path="/barber-dashboard" element={<BarberDashboard />} />
      </Route>

      {/* 🔴 RUTAS PROTEGIDAS SOLO PARA ADMINS */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/users" element={<Users />} />
        
        {/* ✅ NUEVAS RUTAS DE GESTIÓN */}
        <Route path="/gestion-servicios" element={<GestionServicios />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>
      
      {/* 404 - PERSONALIZADO */}
      <Route path="*" element={
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
          <h1 className="text-dk-gold font-vogue text-4xl uppercase tracking-tighter">
            manito nos perdimos, <span className="text-white italic">por aqui no es :c</span>
          </h1>
        </div>
      } />
    </Routes>
  );
}

export default App;