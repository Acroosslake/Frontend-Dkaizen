import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';

function Perfil() {
  const { user, login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [appointments, setAppointments] = useState([]); // 🚩 Estado para las citas
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
      // Filtramos para mostrar solo las que no han pasado o no están canceladas si prefieres
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
        fetchMyAppointments(); // Recargamos la lista
      } catch (e) {
        errorAlert('ERROR', 'No pudimos cancelar la cita en este momento.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-20 relative">
      
      {/* NAVBAR */}
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>
          <Link to={user?.role === 'admin' ? "/dashboard" : "/reservas"} className="text-xs uppercase tracking-widest text-dk-gold font-bold border border-dk-gold/30 px-4 py-1.5 rounded-full hover:bg-dk-gold hover:text-black transition">
            Volver
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto mt-20 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* SECCIÓN IZQUIERDA: FORMULARIO PERFIL */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-dk-gold/5 blur-3xl rounded-full"></div>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-dk-red to-dk-gold rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-vogue shadow-lg border-2 border-black">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-light">Mi <span className="font-vogue text-dk-gold italic">Perfil</span></h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Socio D'Kaizen</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-600 text-[10px] uppercase tracking-widest font-black mb-2 ml-2">Nombre</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-gray-900 rounded-2xl px-5 py-4 text-sm focus:border-dk-gold outline-none transition" />
              </div>

              <div>
                <label className="block text-gray-600 text-[10px] uppercase tracking-widest font-black mb-2 ml-2">WhatsApp</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-gray-900 rounded-2xl px-5 py-4 text-sm focus:border-dk-gold outline-none transition" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-dk-gold transition-all disabled:opacity-50">
                {loading ? 'SINCRONIZANDO...' : 'ACTUALIZAR DATOS'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* SECCIÓN DERECHA: MIS CITAS AGENDADAS */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="flex justify-between items-end mb-8 px-4">
             <div>
                <p className="text-dk-red uppercase tracking-[0.3em] text-[10px] font-bold mb-1">Tu Agenda</p>
                <h2 className="text-4xl font-light">Próximos <span className="font-vogue text-dk-gold italic">Turnos</span></h2>
             </div>
             <span className="text-[10px] text-gray-500 font-bold uppercase border-b border-gray-800 pb-1">
                {appointments.length} Citas activas
             </span>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {loadingAppos ? (
                <p className="text-center py-10 text-gray-600 animate-pulse uppercase text-xs tracking-widest">Consultando agenda...</p>
              ) : appointments.length > 0 ? (
                appointments.map((appo, index) => (
                  <motion.div 
                    key={appo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center group hover:border-dk-gold/30 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      <div className="w-14 h-14 bg-gray-900 rounded-2xl flex flex-col items-center justify-center border border-gray-800 group-hover:border-dk-gold/50 transition-colors">
                        <span className="text-dk-gold font-vogue text-xl leading-none">
                          {new Date(appo.appointment_date).getDate()}
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase font-black">
                          {new Date(appo.appointment_date).toLocaleString('es-ES', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-200">{appo.service?.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-dk-red rounded-full"></span>
                          {appo.barber?.user?.name || 'Barbero D\'Kaizen'} • {new Date(appo.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Monto a Pagar</p>
                        <p className="text-xl font-vogue text-white">${Number(appo.total_price).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => handleCancelarCita(appo.id)}
                        className="bg-red-500/10 text-red-500 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-[#0a0a0a] border border-dashed border-gray-800 rounded-[2.5rem] p-16 text-center">
                   <p className="text-gray-600 uppercase text-xs tracking-[0.2em] mb-6">Aún no tienes cortes programados</p>
                   <Link to="/reservas" className="text-dk-gold text-[10px] font-black uppercase tracking-widest border border-dk-gold/50 px-6 py-3 rounded-full hover:bg-dk-gold hover:text-black transition-all">
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