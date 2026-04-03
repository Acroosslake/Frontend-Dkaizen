import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Nosotros() {
  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans pb-20 relative overflow-hidden">
      
      {/* NAVBAR PÚBLICO */}
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/nosotros" className="text-dk-gold font-bold transition">Nosotros</Link>
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>
          <Link to="/login" className="flex items-center space-x-2 bg-black/40 px-4 py-1.5 rounded-full hover:bg-black/60 transition">
            <span className="text-sm">Iniciar Sesión</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto mt-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* TEXTO Y FILOSOFÍA ANIMADO (Entra por la izquierda) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Nuestra Historia</p>
            <h1 className="text-5xl md:text-6xl font-light mb-8">La Filosofía <span className="font-vogue text-dk-gold italic">Kaizen</span></h1>
            
            <div className="space-y-6 text-gray-300 font-light leading-relaxed">
              <p>
                En la cultura japonesa, la palabra <strong className="text-white font-medium">Kaizen</strong> significa "mejora continua". Esa es la base sobre la que construimos D'Kaizen Barber Shop. No somos solo una barbería; somos un santuario dedicado a la evolución personal.
              </p>
              <p>
                Nacimos con la convicción de que un corte de cabello no es un trámite, sino un ritual. Cada detalle, desde la iluminación hasta los productos premium que utilizamos, está diseñado para ofrecerte una experiencia de lujo y desconexión total.
              </p>
              <p className="border-l-2 border-dk-gold pl-6 py-2 text-lg text-gray-400 italic">
                "No buscamos ser los más rápidos, buscamos la perfección en cada detalle. Tu imagen es nuestra obra de arte."
              </p>
            </div>
          </motion.div>

          {/* IMAGEN ELEGANTE ANIMADA (Entra por la derecha) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-dk-red/20 translate-x-4 translate-y-4 rounded-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Barbero profesional trabajando" 
              className="relative z-10 rounded-xl shadow-2xl border border-gray-800 grayscale hover:grayscale-0 transition duration-700"
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default Nosotros;