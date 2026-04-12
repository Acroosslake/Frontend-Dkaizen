import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-dk-dark overflow-hidden font-sans text-white">
      
      {/* NAVBAR FLOTANTE */}
      <header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl z-50">
        <nav className="bg-dk-red/90 backdrop-blur-md rounded-full px-8 py-3 flex justify-between items-center shadow-2xl border border-red-900/50">
          <div className="text-white font-vogue text-2xl tracking-widest">
            D'Kaizen
          </div>
          
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="text-dk-gold font-bold transition">Inicio</Link>
             <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>

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
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-dk-gold font-bold hover:bg-gray-800 transition-colors">
                        Panel Admin
                      </Link>
                    )}
                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dk-red hover:text-white transition-colors">
                      Mi Perfil
                    </Link>
                    {/* SE QUITÓ AJUSTES AQUÍ */}
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
              <span className="text-sm font-light">Iniciar Sesión</span>
            </Link>
          )}
        </nav>
      </header>

      {/* SECCIÓN 1: HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dk-dark/80 to-dk-dark z-0"></div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
          <p className="text-dk-red uppercase tracking-[0.4em] text-sm font-bold mb-4">El arte del grooming</p>
          <h1 className="font-vogue text-7xl md:text-9xl text-dk-gold tracking-widest mb-6">D'KAIZEN</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 text-gray-300">Donde el corte no es solo una necesidad, sino un ritual de evolución personal.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/reservas"><button className="bg-dk-red hover:bg-red-800 text-white font-bold py-4 px-10 rounded-full tracking-widest transition-all shadow-[0_0_20px_rgba(189,0,3,0.5)]">AGENDAR AHORA</button></Link>
            <Link to="/servicios"><button className="bg-transparent border border-white hover:bg-white hover:text-black text-white font-bold py-4 px-10 rounded-full tracking-widest transition-all">VER MENÚ</button></Link>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN: NOSOTROS */}
      <section id="nosotros" className="relative z-10 bg-[#0a0a0a] py-24 px-4 border-t border-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80" className="rounded-2xl border border-gray-800 grayscale hover:grayscale-0 transition-all duration-700" alt="Nosotros"/>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
            <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Nuestra Historia</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6">Más que un corte, <span className="font-vogue text-dk-gold italic">un estilo de vida</span></h2>
            <p className="text-gray-400 font-light leading-relaxed mb-6">En D'KAIZEN esculpimos confianza. Tradición y vanguardia se unen en un solo lugar.</p>
            <div className="flex items-center gap-4"><div className="w-12 h-px bg-dk-gold"></div><p className="font-vogue text-xl tracking-widest text-white">El Director</p></div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#030303] py-12 text-center border-t border-gray-900">
        <h2 className="font-vogue text-3xl text-dk-gold mb-4">D'KAIZEN</h2>
        <p className="text-gray-600 text-sm italic">Bogotá, Colombia • Elevando el estándar</p>
      </footer>
    </div>
  );
}

export default Home;