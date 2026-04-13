import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';

function Perfil() {
  const navigate = useNavigate();
  const { user, login, logout } = useContext(AuthContext); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAppos, setLoadingAppos] = useState(true);

  // 1. Cargar datos del usuario y sus citas
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchMyAppointments();
    }
  }, [user]);

  const fetchMyAppointments = async () => {
    setLoadingAppos(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (e) {
      console.error("Error cargando citas:", e);
    } finally {
      setLoadingAppos(false);
    }
  };

  // 2. Lógica para Actualizar Perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/update', {
        name: formData.name,
        phone: formData.phone
      });
      
      const currentToken = localStorage.getItem('token');
      if (currentToken) await login(currentToken);

      successAlert('¡PERFIL LISTO!', 'Tus datos se han actualizado correctamente.');
    } catch (error) {
      errorAlert('¡ERROR!', error.response?.data?.message || 'No pudimos actualizar tu perfil.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Lógica para Cancelar Cita
  const handleCancelarCita = async (id) => {
    const res = await confirmAction(
      '¿CANCELAR ESTA CITA?',
      'Se liberará el espacio para otro cliente. Esta acción no se puede deshacer.',
      'SÍ, CANCELAR'
    );

    if (res.isConfirmed) {
      try {
        await api.delete(`/appointments/${id}`);
        successAlert('¡CANCELADA!', 'Tu cita ha sido eliminada con éxito.');
        fetchMyAppointments(); 
      } catch (e) {
        errorAlert('ERROR', 'No pudimos cancelar la cita en este momento.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-20 relative overflow-x-hidden selection:bg-dk-gold selection:text-black">
      
      {/* 🌟 EFECTO DE LUZ SUPERIOR */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-dk-gold/5 via-[#030303]/80 to-[#030303]"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-dk-gold/5 blur-[150px] rounded-full"></div>
      </div>

      {/* 🌟 CABECERA MINIMALISTA (MARCO SUPERIOR) */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 pt-8 z-50">
        <Link to="/" className="text-2xl md:text-3xl font-vogue text-white tracking-widest hover:text-dk-gold transition-colors drop-shadow-lg">
          D'KAIZEN
        </Link>

        <div>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 px-5 py-2.5 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase text-white shadow-xl"
            >
              <span>{user?.name?.split(' ')[0]}</span>
              <svg className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                  className="absolute right-0 mt-3 w-48 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-800 rounded-2xl py-2 shadow-2xl overflow-hidden"
                >
                  {user?.role === 'admin' && (
                    <Link to="/dashboard" className="block px-5 py-3 text-[10px] uppercase tracking-widest text-dk-gold font-black hover:bg-gray-900 transition-colors border-b border-gray-900/50">Panel Admin</Link>
                  )}
                  <Link to="/reservas" className="block px-5 py-3 text-[10px] uppercase tracking-widest text-gray-300 hover:bg-gray-900 transition-colors border-b border-gray-900/50">Reservar Turno</Link>
                  <button onClick={logout} className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-900/20 transition-colors font-bold">Cerrar Sesión</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 🌟 CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto mt-28 md:mt-32 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        
        {/* SECCIÓN IZQUIERDA: FORMULARIO PERFIL */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-1">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-gray-800/50 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-dk-gold/10 blur-3xl rounded-full"></div>
            
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-tr from-[#111] to-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-vogue shadow-lg border border-gray-800 text-dk-gold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-light">Mi <span className="font-vogue text-dk-gold italic">Perfil</span></h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-2">Socio D'Kaizen</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-500 text-[9px] uppercase tracking-[0.2em] font-black mb-2 ml-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[#111] border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-dk-gold transition-colors text-white" 
                />
              </div>

              <div>
                <label className="block text-gray-500 text-[9px] uppercase tracking-[0.2em] font-black mb-2 ml-2">WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-[#111] border border-gray-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-dk-gold transition-colors text-white" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-white text-black font-black py-4 mt-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-dk-gold transition-all transform hover:scale-[1.02] shadow-[0_10px_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {loading ? 'Sincronizando...' : 'Actualizar Datos'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/" className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SECCIÓN DERECHA: MIS CITAS AGENDADAS */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 px-2 gap-4">
             <div>
                <p className="text-dk-red uppercase tracking-[0.4em] text-[10px] font-bold mb-2">Tu Agenda</p>
                <h2 className="text-5xl font-light">Próximos <span className="font-vogue text-dk-gold italic">Turnos</span></h2>
             </div>
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-b border-gray-800 pb-1">
                {appointments.length} Cita{appointments.length !== 1 && 's'} activa{appointments.length !== 1 && 's'}
             </span>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {loadingAppos ? (
                <p className="text-center py-20 text-gray-600 animate-pulse uppercase text-[10px] tracking-widest font-bold">Consultando la agenda maestra...</p>
              ) : appointments.length > 0 ? (
                appointments.map((appo, index) => (
                  <motion.div 
                    key={appo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/50 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:border-dk-gold/30 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto">
                      <div className="min-w-[4rem] h-16 bg-[#111] rounded-2xl flex flex-col items-center justify-center border border-gray-800 group-hover:border-dk-gold/50 transition-colors shadow-inner">
                        <span className="text-dk-gold font-vogue text-2xl leading-none">
                          {new Date(appo.appointment_date).getDate()}
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-1">
                          {new Date(appo.appointment_date).toLocaleString('es-ES', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-200 mb-1">{appo.service?.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 font-medium">
                          <span className="w-1.5 h-1.5 bg-dk-red rounded-full shadow-[0_0_5px_rgba(189,0,3,0.8)]"></span>
                          {appo.barber?.user?.name || 'Barbero D\'Kaizen'} • {new Date(appo.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t border-gray-800 md:border-t-0 pt-6 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Monto a Pagar</p>
                        <p className="text-2xl font-vogue text-white">${Number(appo.total_price).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => handleCancelarCita(appo.id)}
                        className="bg-transparent border border-red-900/50 text-red-500 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-[#0a0a0a]/50 backdrop-blur-sm border border-dashed border-gray-800 rounded-[3rem] p-16 text-center">
                   <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                     <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   </div>
                   <p className="text-gray-500 uppercase text-[10px] tracking-[0.3em] font-bold mb-8">Aún no tienes cortes programados</p>
                   <Link to="/reservas" className="inline-block bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-dk-gold transition-all transform hover:scale-105 shadow-xl">
                      Agendar mi primer turno
                   </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Perfil;