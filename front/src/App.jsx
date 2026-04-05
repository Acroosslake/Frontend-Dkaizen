import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;