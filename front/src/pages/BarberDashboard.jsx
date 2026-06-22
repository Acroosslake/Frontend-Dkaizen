import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // ✅ Importamos el contexto de autenticación

function BarberDashboard() {
  const { logout } = useContext(AuthContext); // ✅ Extraemos la función para cerrar sesión
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await api.get('/appointments');
        setTurnos(response.data);
      } catch (error) {
        console.error("Error al cargar la agenda del barbero:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  }, []);

  // Configuraciones para las animaciones en cascada
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 px-4 md:px-6 pb-12 relative overflow-hidden">
      
      {/* 🌟 EFECTOS DE FONDO (Atmosférico) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-dk-gold/5 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-dk-gold/5 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* 🛸 NAVBAR FLOTANTE ESTILO GLASSMORPHISM */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-gold/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
      >
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">
          D'KAIZEN
        </div>
        
        <Link to="/barber-dashboard" className="text-dk-gold font-bold uppercase tracking-widest text-[11px]">
          Mi Agenda
        </Link>
        
        {/* Espacio por si a futuro quieres agregar "Mi Perfil" o "Historial" */}
        <span className="text-gray-600 hidden sm:block">•</span>

        <button 
          onClick={() => logout()} 
          className="group flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors pl-6 border-l border-gray-800 uppercase text-[10px] font-bold"
        >
          <span>Salir</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </motion.nav>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* CABECERA DEL PANEL */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800/50 pb-6"
        >
          <div>
            <p className="text-dk-gold/70 uppercase tracking-[0.3em] text-[10px] font-bold mb-2">Panel de Barbero</p>
            <h1 className="text-5xl font-vogue text-dk-gold drop-shadow-lg">Mi Agenda</h1>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Turnos Hoy</p>
              <p className="text-2xl font-vogue text-white">{turnos.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-dk-gold/10 flex items-center justify-center border border-dk-gold/20">
              <svg className="w-6 h-6 text-dk-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* LISTA DE TURNOS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dk-gold"></div>
          </div>
        ) : turnos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-gray-800/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800">
              <svg className="w-10 h-10 text-dk-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-vogue text-white mb-2">Día Libre</h3>
            <p className="text-gray-500 text-sm tracking-wide">No tienes turnos programados por ahora. ¡Tómate un café!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            <AnimatePresence>
              {turnos.map((turno) => (
                <motion.div 
                  key={turno.id}
                  variants={itemVariants}
                  className="group relative bg-[#0a0a0a]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-gray-800/60 hover:border-dk-gold/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-dk-gold/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-dk-gold/0 via-dk-gold/5 to-dk-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {/* FECHA Y HORA */}
                    <div className="flex-shrink-0 flex items-center gap-4 md:w-48">
                      <div className="w-14 h-14 bg-black border border-gray-800 rounded-2xl flex flex-col items-center justify-center shadow-inner group-hover:border-dk-gold/30 transition-colors">
                        <span className="text-xs text-gray-500 uppercase font-bold">DÍA</span>
                        <span className="text-lg font-vogue text-dk-gold">{turno.appointment_date.substring(8,10)}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{turno.appointment_date.substring(11,16) || 'N/A'}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-500">{turno.appointment_date.substring(0,10)}</p>
                      </div>
                    </div>

                    {/* INFO DEL CLIENTE */}
                    <div className="flex-1 w-full border-t border-b border-gray-800/50 md:border-none py-4 md:py-0">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-dk-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-xl font-bold text-white tracking-wide">{turno.user?.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm pl-6">{turno.service?.name || 'Servicio de Barbería'}</p>
                    </div>

                    {/* ESTADO Y PRECIO */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3">
                      <span className="text-2xl font-vogue text-white tracking-wider">
                        $ {Number(turno.total_price).toLocaleString('es-CO')}
                      </span>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border
                        ${turno.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          turno.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'}
                      `}>
                        {turno.status === 'pending' ? 'Pendiente' : turno.status}
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BarberDashboard;