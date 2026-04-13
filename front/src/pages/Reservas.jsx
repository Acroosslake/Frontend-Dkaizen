import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { successAlert, errorAlert } from '../utils/alerts';

function Reservas() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // --- ESTADOS DE DATOS ---
  const [serviciosDB, setServiciosDB] = useState([]);
  const [barberosDB, setBarberosDB] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]); // 🚩 Horas ya ocupadas
  
  // --- ESTADOS DE SELECCIÓN ---
  const [servicio, setServicio] = useState(null);
  const [barbero, setBarbero] = useState(null);
  const [hora, setHora] = useState(null);
  
  // --- ESTADOS DE UI ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Horarios base de la barbería
  const totalSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  // 1. CARGA INICIAL (Servicios y Barberos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resServ = await api.get('/services');
        setServiciosDB(Array.isArray(resServ.data) ? resServ.data : []);
        const resBarb = await api.get('/barbers');
        setBarberosDB(Array.isArray(resBarb.data) ? resBarb.data : []);
      } catch (e) { console.error("Error al cargar datos iniciales:", e); }
    };
    fetchData();
  }, []);

  // 2. BUSCAR DISPONIBILIDAD (Cuando cambia el barbero)
  useEffect(() => {
    if (barbero) {
      const fetchOccupied = async () => {
        const fechaHoy = new Date().toISOString().split('T')[0];
        try {
          const res = await api.get(`/appointments/occupied?barber_id=${barbero}&date=${fechaHoy}`);
          setOccupiedSlots(res.data); // Recibimos array de horas: ["10:00", "14:00"]
        } catch (e) { console.error("Error al chequear disponibilidad:", e); }
      };
      fetchOccupied();
    }
  }, [barbero]);

  // 3. HELPER PARA CONVERTIR Y COMPARAR HORAS
  const isSlotOccupied = (slotStr) => {
    const [time, modifier] = slotStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
    if (modifier === 'AM' && hours === '12') hours = '00';
    const formatted = `${String(hours).padStart(2, '0')}:${minutes}`;
    return occupiedSlots.includes(formatted);
  };

  // 4. CONFIRMACIÓN DE RESERVA
  const handleConfirmarReserva = async () => {
    if (!servicio || !barbero || !hora) return;
    setLoading(true);
    try {
      const [time, modifier] = hora.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
      if (modifier === 'AM' && hours === '12') hours = '00';
      
      const fechaHoy = new Date().toISOString().split('T')[0];
      const appointment_date = `${fechaHoy} ${hours}:${minutes}:00`;

      await api.post('/appointments', {
        service_id: servicio,
        barber_id: barbero,
        appointment_date: appointment_date
      });

      await successAlert('¡RESERVA EXITOSA!', 'Tu turno ha sido bloqueado. ¡Te vemos pronto, fiera!');
      navigate('/perfil');
    } catch (error) {
      errorAlert('¡ERROR!', error.response?.data?.message || 'No se pudo agendar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans pb-20 relative">
      
      {/* NAVBAR */}
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="text-dk-gold font-bold transition">Reservas</Link>
          </ul>
          
          {user ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 bg-dk-dark hover:bg-black px-4 py-1.5 rounded-full border border-dk-gold/50 transition-colors">
                <span className="text-sm font-bold text-dk-gold">Hola, {user.name?.split(' ')[0]}</span>
                <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-3 w-48 bg-[#111] border border-gray-800 rounded-xl py-2 z-50 shadow-2xl">
                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dk-red hover:text-white transition-colors">Mi Perfil / Mis Citas</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition-colors">Cerrar Sesión</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="bg-black/40 px-4 py-1.5 rounded-full border border-gray-700 text-sm">Iniciar Sesión</Link>
          )}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Agenda tu espacio</p>
          <h1 className="text-5xl md:text-6xl font-light italic">Reserva tu <span className="font-vogue text-dk-gold not-italic">Experiencia</span></h1>
        </div>

        <div className="space-y-12">
          {/* PASO 1: SERVICIOS */}
          <section>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">01.</span> Servicio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviciosDB.map((s) => (
                <div key={s.id} onClick={() => setServicio(s.id)} className={`p-6 border rounded-xl cursor-pointer transition-all ${servicio === s.id ? 'border-dk-gold bg-dk-gold/10' : 'border-gray-800 bg-[#111] hover:border-gray-600'}`}>
                  <h3 className="font-bold">{s.name}</h3>
                  <p className="text-sm text-gray-400 mt-2">${s.price} • {s.duration} min</p>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 2: BARBEROS */}
          <section className={`transition-all duration-500 ${servicio ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">02.</span> Barbero
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {barberosDB.map((b) => (
                <div key={b.id} onClick={() => { setBarbero(b.id); setHora(null); }} className={`p-4 border rounded-xl text-center cursor-pointer transition-all ${barbero === b.id ? 'border-dk-red bg-dk-red/10' : 'border-gray-800 bg-[#111] hover:border-gray-600'}`}>
                   <h3 className="font-medium text-sm">{b.user?.name}</h3>
                   <p className="text-[10px] text-dk-gold uppercase mt-1">{b.specialty}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 3: HORARIOS REALES */}
          <section className={`transition-all duration-500 ${barbero ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">03.</span> Horario para hoy
            </h2>
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-inner">
              <div className="flex flex-wrap gap-3">
                {totalSlots.map((h, i) => {
                  const busy = isSlotOccupied(h);
                  return (
                    <button 
                      key={i} 
                      disabled={busy}
                      onClick={() => setHora(h)}
                      className={`px-6 py-2 rounded-full border text-xs transition-all ${
                        busy 
                          ? 'opacity-10 cursor-not-allowed border-transparent bg-gray-900 line-through' 
                          : hora === h 
                            ? 'bg-white text-black border-white font-black scale-105 shadow-lg' 
                            : 'border-gray-700 text-gray-400 hover:border-white hover:text-white'
                      }`}
                    >
                      {h} {busy && '• Ocupado'}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-600 mt-6 uppercase tracking-widest text-center">Selecciona un horario disponible para confirmar</p>
            </div>
          </section>
        </div>

        <div className={`mt-12 text-center transition-all ${hora ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleConfirmarReserva}
            disabled={loading}
            className="bg-dk-red hover:bg-red-800 text-white font-black py-5 px-16 rounded-full tracking-widest transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50"
          >
            {loading ? 'SINCRONIZANDO...' : 'CONFIRMAR MI TURNO'}
          </button>
          <p className="mt-4 text-[10px] text-gray-500 uppercase">Al confirmar, aceptas nuestra política de inasistencias.</p>
        </div>
      </main>
    </div>
  );
}

export default Reservas;