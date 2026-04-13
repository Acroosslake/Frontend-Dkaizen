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
  const [occupiedSlots, setOccupiedSlots] = useState([]); 
  
  // --- ESTADOS DE SELECCIÓN ---
  const [servicio, setServicio] = useState(null);
  const [barbero, setBarbero] = useState(null);
  const [hora, setHora] = useState(null);
  
  // --- ESTADOS DE UI ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Horarios base de la barbería
  const totalSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. CARGA INICIAL
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

  // 2. BUSCAR DISPONIBILIDAD
  useEffect(() => {
    if (barbero) {
      const fetchOccupied = async () => {
        const fechaHoy = new Date().toISOString().split('T')[0];
        try {
          const res = await api.get(`/appointments/occupied?barber_id=${barbero}&date=${fechaHoy}`);
          setOccupiedSlots(res.data);
        } catch (e) { console.error("Error al chequear disponibilidad:", e); }
      };
      fetchOccupied();
    }
  }, [barbero]);

  // 3. HELPER PARA HORAS
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
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-20 relative overflow-x-hidden selection:bg-dk-gold selection:text-black">
      
      {/* 🌟 IMAGEN DE FONDO ATMOSFÉRICA */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/10 via-[#030303]/80 to-[#030303]"></div>
      </div>

      {/* 🌟 NAVBAR FLOTANTE PREMIUM */}
      <header className="fixed top-6 w-full flex justify-center z-50 px-4">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex justify-between items-center w-full max-w-5xl px-8 py-4 rounded-full transition-all duration-500 ${
            scrolled ? 'bg-black/80 backdrop-blur-xl border border-gray-800 shadow-2xl' : 'bg-black/30 backdrop-blur-md border border-white/10'
          }`}
        >
          <div className="text-2xl font-vogue text-white tracking-widest">
            D'KAIZEN
          </div>

          <ul className="hidden md:flex space-x-10 text-[11px] font-black uppercase tracking-widest text-gray-300">
            <li><Link to="/" className="hover:text-dk-gold transition-colors">Inicio</Link></li>
            <li><Link to="/servicios" className="hover:text-dk-gold transition-colors">Servicios</Link></li>
            <li><Link to="/reservas" className="text-dk-gold">Reservas</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="flex items-center gap-2 bg-dk-red hover:bg-red-800 px-5 py-2 rounded-full transition-colors text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(189,0,3,0.4)]"
                >
                  <span>{user.name?.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                      className="absolute right-0 mt-4 w-48 bg-[#0a0a0a] border border-gray-800 rounded-2xl py-2 shadow-2xl overflow-hidden"
                    >
                      {user.role === 'admin' && (
                        <Link to="/dashboard" className="block px-5 py-3 text-xs uppercase tracking-widest text-dk-gold font-bold hover:bg-gray-900 transition-colors border-b border-gray-900">Panel Admin</Link>
                      )}
                      <Link to="/perfil" className="block px-5 py-3 text-xs uppercase tracking-widest text-gray-300 hover:bg-gray-900 transition-colors">Mi Perfil</Link>
                      <button onClick={logout} className="w-full text-left px-5 py-3 text-xs uppercase tracking-widest text-red-500 hover:bg-red-900/20 transition-colors">Cerrar Sesión</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-dk-gold transition-colors">
                Ingresar
              </Link>
            )}
          </div>
        </motion.nav>
      </header>

      {/* 🌟 CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto pt-40 px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-dk-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4">Agenda tu espacio</p>
          <h1 className="text-5xl md:text-7xl font-light">Reserva tu <span className="font-vogue text-dk-gold italic">Experiencia</span></h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-16">
          
          {/* PASO 1: SERVICIOS */}
          <section>
            <div className="flex items-end gap-4 mb-8 border-b border-gray-900 pb-4">
              <span className="text-dk-gold font-vogue text-5xl leading-none">01</span>
              <h2 className="text-2xl font-light tracking-wide uppercase">Servicio</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviciosDB.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setServicio(s.id)} 
                  className={`relative p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 overflow-hidden group ${
                    servicio === s.id 
                    ? 'border-dk-gold bg-dk-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                    : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-600 hover:bg-[#111]'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-2 h-full transition-colors ${servicio === s.id ? 'bg-dk-gold' : 'bg-transparent group-hover:bg-gray-800'}`}></div>
                  <h3 className="font-bold text-lg mb-4 text-gray-200 group-hover:text-white transition-colors">{s.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dk-gold font-vogue text-xl">${Number(s.price).toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">⏱ {s.duration} MIN</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 2: BARBEROS */}
          <section className={`transition-all duration-700 ${servicio ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
            <div className="flex items-end gap-4 mb-8 border-b border-gray-900 pb-4">
              <span className="text-dk-gold font-vogue text-5xl leading-none">02</span>
              <h2 className="text-2xl font-light tracking-wide uppercase">Especialista</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {barberosDB.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => { setBarbero(b.id); setHora(null); }} 
                  className={`p-6 rounded-[2rem] border text-center cursor-pointer transition-all duration-300 ${
                    barbero === b.id 
                    ? 'border-dk-red bg-dk-red/5 shadow-[0_0_30px_rgba(189,0,3,0.15)]' 
                    : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-600 hover:bg-[#111]'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto rounded-full mb-4 border border-gray-700 overflow-hidden bg-gray-900 p-1">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-vogue text-2xl text-gray-600">
                       {b.user?.name?.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-gray-200">{b.user?.name}</h3>
                  <p className="text-[9px] text-dk-gold uppercase tracking-[0.2em] mt-2">{b.specialty}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 3: HORARIOS REALES */}
          <section className={`transition-all duration-700 ${barbero ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
            <div className="flex items-end gap-4 mb-8 border-b border-gray-900 pb-4">
              <span className="text-dk-gold font-vogue text-5xl leading-none">03</span>
              <h2 className="text-2xl font-light tracking-wide uppercase">Horario</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-dk-gold/5 blur-[100px] rounded-full"></div>
              
              <div className="flex flex-wrap gap-4 relative z-10 justify-center md:justify-start">
                {totalSlots.map((h, i) => {
                  const busy = isSlotOccupied(h);
                  return (
                    <button 
                      key={i} 
                      disabled={busy}
                      onClick={() => setHora(h)}
                      className={`px-8 py-3 rounded-full border text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
                        busy 
                          ? 'opacity-20 cursor-not-allowed border-gray-800 bg-transparent line-through text-gray-500' 
                          : hora === h 
                            ? 'bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                            : 'border-gray-800 text-gray-400 bg-black hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      {h} {busy && <span className="ml-1 normal-case font-normal">(Ocupado)</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-gray-600 mt-8 uppercase tracking-[0.3em] text-center md:text-left relative z-10">Selecciona el espacio de tu preferencia para continuar</p>
            </div>
          </section>

        </motion.div>

        {/* BOTÓN FINAL DE CONFIRMACIÓN */}
        <div className={`mt-16 text-center transition-all duration-700 ${hora ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <button 
            onClick={handleConfirmarReserva}
            disabled={loading}
            className="bg-dk-red hover:bg-red-800 text-white font-black py-5 px-16 rounded-full text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(189,0,3,0.5)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'SINCRONIZANDO...' : 'CONFIRMAR MI TURNO'}
          </button>
          <p className="mt-6 text-[9px] text-gray-500 uppercase tracking-widest">Al confirmar, aceptas nuestra política de inasistencias y reservas.</p>
        </div>
      </main>
    </div>
  );
}

export default Reservas;