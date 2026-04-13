import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-dk-gold selection:text-black">
      
      {/* 🌟 CABECERA MINIMALISTA (MARCO SUPERIOR) */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 pt-8 z-50">
        {/* Logo a la izquierda */}
        <Link to="/" className="text-2xl md:text-3xl font-vogue text-white tracking-widest hover:text-dk-gold transition-colors drop-shadow-lg">
          D'KAIZEN
        </Link>

        {/* Botón Flotante a la derecha */}
        <div>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 px-5 py-2.5 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase text-white shadow-xl"
              >
                <span>{user.name?.split(' ')[0]}</span>
                <span className="w-2 h-2 rounded-full bg-dk-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    className="absolute right-0 mt-3 w-48 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-800 rounded-2xl py-2 shadow-2xl overflow-hidden"
                  >
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className="block px-5 py-3 text-[10px] uppercase tracking-widest text-dk-gold font-black hover:bg-gray-900 transition-colors border-b border-gray-900/50">Panel Admin</Link>
                    )}
                    <Link to="/perfil" className="block px-5 py-3 text-[10px] uppercase tracking-widest text-gray-300 hover:bg-gray-900 transition-colors border-b border-gray-900/50">Mi Perfil / Citas</Link>
                    <button onClick={logout} className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-900/20 transition-colors font-bold">Cerrar Sesión</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
              Ingresar
            </Link>
          )}
        </div>
      </header>

      {/* 🌟 HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/20 via-[#030303]/60 to-[#030303]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-4xl"
        >
          <p className="text-dk-red font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-6 drop-shadow-md">El Arte del Grooming</p>
          <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-vogue text-dk-gold leading-none mb-6 drop-shadow-2xl tracking-wide">
            D'KAIZEN
          </h1>
          <p className="text-gray-300 font-light tracking-wide text-sm md:text-lg mb-12 max-w-xl mx-auto drop-shadow-lg">
            Donde el corte no es solo una necesidad, sino un <span className="text-white font-medium italic">ritual de evolución personal.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/reservas" className="w-full sm:w-auto bg-dk-red hover:bg-red-800 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(189,0,3,0.5)]">
              Agendar Ahora
            </Link>
            <Link to="/servicios" className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:border-dk-gold hover:bg-dk-gold/5 hover:text-dk-gold px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all backdrop-blur-sm">
              Servicios
            </Link>
          </div>
        </motion.div>

        {/* 🌟 SCROLL INDICATOR (MARCO INFERIOR) */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
        >
          <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 mb-2">Descubre</p>
          <div className="w-px h-12 bg-gradient-to-b from-dk-gold to-transparent opacity-50"></div>
        </motion.div>
      </section>

      {/* 🌟 ACERCA DE NOSOTROS */}
      <section className="relative py-32 px-4 md:px-12 bg-[#0a0a0a] border-t border-gray-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-dk-red font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Nuestra Filosofía</p>
            <h2 className="text-4xl md:text-6xl font-light mb-8">Evolución <span className="font-vogue text-dk-gold italic">Constante</span></h2>
            
            <div className="space-y-6 text-gray-400 font-light text-sm md:text-base leading-relaxed">
              <p>
                En <strong className="text-white">D'KAIZEN</strong> no solo cortamos cabello; esculpimos identidad. Nacimos con la firme convicción de que el cuidado personal masculino merece un nivel de detalle absoluto.
              </p>
              <p>
                <span className="italic text-dk-gold">"Kaizen"</span> significa mejora continua. Esa es nuestra promesa: utilizar herramientas de precisión, productos de primer nivel y una técnica pulida para asegurar que cada visita sea superior a la anterior. No seguimos tendencias, las adaptamos a tu estructura.
              </p>
            </div>

            <div className="mt-12 flex gap-10 border-t border-gray-800 pt-8">
              <div>
                <p className="text-4xl font-vogue text-white">100<span className="text-dk-gold">%</span></p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-2">Atención Premium</p>
              </div>
              <div>
                <p className="text-4xl font-vogue text-white">+5</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-2">Años de Maestría</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden relative border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
               <div 
                 className="absolute inset-0 bg-cover bg-center bg-gray-900" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop')" }} 
               ></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
               
               <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-dk-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-2">Pilar Fundamental</p>
                  <p className="font-vogue text-2xl text-white">"La perfección no es un destino, es un hábito."</p>
               </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-dk-red rounded-full opacity-50 hidden md:block animate-spin-slow"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-dk-gold rounded-full opacity-20 hidden md:block"></div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 SECCIÓN DEL MAPA (UBICACIÓN) */}
      <section className="relative py-32 px-4 md:px-12 bg-[#030303]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-dk-red font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Nuestra Sede</p>
            <h2 className="text-4xl md:text-6xl font-light">Encuéntranos en <span className="font-vogue text-dk-gold italic">Bogotá</span></h2>
            <p className="text-gray-500 mt-6 max-w-md mx-auto text-sm">Visita nuestras instalaciones de primer nivel. Un espacio diseñado exclusivamente para tu comodidad y estilo.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[3rem] overflow-hidden border border-gray-900 shadow-2xl bg-[#0a0a0a] p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-full md:w-1/3 space-y-8 px-4">
              <div>
                <h3 className="text-dk-gold font-vogue text-2xl mb-2">Dirección</h3>
                <p className="text-gray-400 text-sm">Calle 123 # 45-67<br/>Zona T, Bogotá, Colombia</p>
              </div>
              <div>
                <h3 className="text-dk-gold font-vogue text-2xl mb-2">Horarios</h3>
                <p className="text-gray-400 text-sm">Lunes a Sábado: 10:00 AM - 8:00 PM<br/>Domingos: Cerrado</p>
              </div>
              <div>
                <h3 className="text-dk-gold font-vogue text-2xl mb-2">Contacto</h3>
                <p className="text-gray-400 text-sm">+57 300 123 4567<br/>hola@dkaizen.com</p>
              </div>
              <Link to="/reservas" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-white border-b border-dk-red pb-1 hover:text-dk-red transition-colors">
                Reserva tu espacio →
              </Link>
            </div>

            <div className="w-full md:w-2/3 h-[400px] rounded-3xl overflow-hidden relative bg-black">
              <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127255.1219665893!2d-74.16815338166418!3d4.648283717276703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1!5e0!3m2!1ses!2sco!4v1713000000000!5m2!1ses!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert-[90%] hue-rotate-180 contrast-125 grayscale-[20%]"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 py-12 text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] bg-black">
        <p>© {new Date().getFullYear()} D'KAIZEN BARBER. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;