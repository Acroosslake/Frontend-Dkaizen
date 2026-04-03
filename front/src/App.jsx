// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Staff from './pages/Staff';
import Reservas from './pages/Reservas';
import Nosotros from './pages/Nosotros'; // <-- Nueva
import Servicios from './pages/Servicios'; // <-- Nueva

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
        <Route path="/nosotros" element={<Nosotros />} /> {/* <-- Nueva */}
        <Route path="/servicios" element={<Servicios />} /> {/* <-- Nueva */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;