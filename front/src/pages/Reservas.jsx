import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Reservas() {
  const [servicio, setServicio] = useState(null);
  const [barbero, setBarbero] = useState(null);
  const [hora, setHora] = useState(null);
  
  // Estado para el menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Extraemos datos del cerebro (AuthContext)
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans pb-20 relative">
      
      {/* NAVBAR PÚBLICO ACTUALIZADO */}
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            {/* Quitamos "Nosotros" porque ahora es sección del Home */}
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="text-dk-gold font-bold transition">Reservas</Link>
          </ul>
          
          {/* MENÚ DESPLEGABLE LIMPIO */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 bg-dk-dark hover:bg-black px-4 py-1.5 rounded-full border border-dk-gold/50 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]"
              >
                <span className="text-sm font-bold text-dk-gold">
                  Hola, {user.name ? user.name.split(' ')[0] : 'Jefe'}
                </span>
                <svg className={`w-4 h-4 text-dk-gold transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-48 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl py-2 overflow-hidden z-50"
                  >
                    {/* Solo aparece si eres Admin */}
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-dk-gold font-bold hover:bg-gray-800 transition-colors">
                        Panel Admin
                      </Link>
                    )}
                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dk-red hover:text-white transition-colors">
                      Mi Perfil
                    </Link>
                    <div className="border-t border-gray-800 my-1"></div>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium"
                    >
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center space-x-2 bg-black/40 px-4 py-1.5 rounded-full hover:bg-black/60 transition text-white border border-gray-700"
            >
              <span className="text-sm">Iniciar Sesión</span>
            </Link>
          )}
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto mt-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Agenda tu espacio</p>
          <h1 className="text-5xl md:text-6xl font-light">Reserva tu <span className="font-vogue text-dk-gold italic">Experiencia</span></h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12"
        >
          
          {/* PASO 1: SERVICIOS */}
          <section>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">01.</span> Selecciona un Servicio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 1, nombre: "Corte Premium", precio: "$35,000", tiempo: "45 min" },
                { id: 2, nombre: "Combo D'Kaizen (Corte + Barba)", precio: "$55,000", tiempo: "1h 15m" },
                { id: 3, nombre: "Perfilado de Barba", precio: "$25,000", tiempo: "30 min" },
              ].map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setServicio(s.id)}
                  className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                    servicio === s.id 
                    ? 'border-dk-gold bg-dk-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] transform scale-105' 
                    : 'border-gray-800 bg-[#111111] hover:border-gray-500'
                  }`}
                >
                  <h3 className="font-medium text-lg mb-2">{s.nombre}</h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="text-white font-bold">{s.precio}</span>
                    <span>⏱ {s.tiempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 2: BARBEROS */}
          <section className={`transition-all duration-500 ${servicio ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">02.</span> Elige a tu Barbero
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 1, nombre: "Julian V.", nivel: "Master" },
                { id: 2, nombre: "Alex R.", nivel: "Senior" },
                { id: 3, nombre: "Cualquiera", nivel: "Próximo libre" },
              ].map((b) => (
                <div 
                  key={b.id}
                  onClick={() => setBarbero(b.id)}
                  className={`p-4 border rounded-xl text-center cursor-pointer transition-all duration-300 ${
                    barbero === b.id 
                    ? 'border-dk-red bg-dk-red/10 transform scale-105' 
                    : 'border-gray-800 bg-[#111111] hover:border-gray-500'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full mb-3 border border-gray-600"></div>
                  <h3 className="font-medium">{b.nombre}</h3>
                  <p className="text-xs text-dk-gold mt-1 uppercase tracking-wider">{b.nivel}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PASO 3: FECHA Y HORA */}
          <section className={`transition-all duration-500 ${barbero ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <h2 className="text-xl font-light mb-6 flex items-center border-b border-gray-800 pb-2">
              <span className="text-dk-gold font-vogue text-2xl mr-3">03.</span> Fecha y Hora
            </h2>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-4">Horarios disponibles para hoy:</p>
              <div className="flex flex-wrap gap-3">
                {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map((h, i) => (
                  <button 
                    key={i}
                    onClick={() => setHora(h)}
                    className={`px-6 py-2 rounded-full border text-sm transition-all duration-300 ${
                      hora === h 
                      ? 'bg-white text-black border-white font-bold transform scale-110' 
                      : 'border-gray-700 text-gray-300 hover:border-white'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </section>

        </motion.div>

        {/* BOTÓN FINAL */}
        <div className={`mt-12 text-center transition-all duration-500 ${hora ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <button className="bg-dk-red hover:bg-red-800 text-white font-bold py-4 px-12 rounded-full tracking-wide transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(189,0,3,0.6)] text-lg">
            CONFIRMAR RESERVA
          </button>
        </div>

      </main>
    </div>
  );
}

export default Reservas;