// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importamos la magia

function Home() {
  return (
    <div className="relative min-h-screen bg-dk-dark overflow-hidden">
      
      {/* NAVBAR FLOTANTE */}
      <header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl z-50">
        <nav className="bg-dk-red/90 backdrop-blur-md rounded-full px-8 py-3 flex justify-between items-center shadow-2xl border border-red-900/50">
          <div className="text-white font-vogue text-2xl tracking-widest">
            D'Kaizen
          </div>
          
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="text-dk-gold font-bold transition">Inicio</Link>
            <Link to="/nosotros" className="hover:text-dk-gold transition">Nosotros</Link>
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>

          <Link to="/login" className="flex items-center space-x-2 bg-black/40 px-4 py-1.5 rounded-full hover:bg-black/60 transition text-white border border-gray-700">
            <span className="text-sm tracking-wide">Admin Access</span>
          </Link>
        </nav>
      </header>

      {/* SECCIÓN 1: HERO ANIMADO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Fondo con Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed' // Efecto Parallax nativo
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dk-dark/80 to-dk-dark z-0"></div>

        {/* Contenido Animado con Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="text-dk-red uppercase tracking-[0.4em] text-sm font-bold mb-4">El arte del grooming</p>
          <h1 className="font-vogue text-7xl md:text-9xl text-dk-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] tracking-widest mb-6">
            D'KAIZEN
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 text-gray-300">
            Donde el corte no es solo una necesidad, sino un ritual de evolución personal y elegancia absoluta.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/reservas">
              <button className="bg-dk-red hover:bg-red-800 text-white font-bold py-4 px-10 rounded-full tracking-widest transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(189,0,3,0.5)]">
                AGENDAR AHORA
              </button>
            </Link>
            <Link to="/servicios">
              <button className="bg-transparent border border-white hover:bg-white hover:text-black text-white font-bold py-4 px-10 rounded-full tracking-widest transition-all duration-300">
                VER MENÚ
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* SECCIÓN 2: CARACTERÍSTICAS (Aparecen al hacer scroll) */}
      <section className="relative z-10 bg-dk-dark py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Tarjeta 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-gold transition-colors duration-500"
          >
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-xl font-vogue text-white mb-3">Master Barbers</h3>
            <p className="text-gray-400 font-light text-sm">Profesionales de élite entrenados para esculpir tu mejor versión con precisión quirúrgica.</p>
          </motion.div>

          {/* Tarjeta 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-red transition-colors duration-500"
          >
            <div className="text-4xl mb-4">🥃</div>
            <h3 className="text-xl font-vogue text-white mb-3">Zona VIP</h3>
            <p className="text-gray-400 font-light text-sm">Disfruta de una bebida de cortesía mientras esperas en nuestro lounge exclusivo.</p>
          </motion.div>

          {/* Tarjeta 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-gold transition-colors duration-500"
          >
            <div className="text-4xl mb-4">✂️</div>
            <h3 className="text-xl font-vogue text-white mb-3">Productos Premium</h3>
            <p className="text-gray-400 font-light text-sm">Utilizamos únicamente las mejores marcas internacionales para el cuidado de tu cabello y barba.</p>
          </motion.div>

        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="relative z-10 bg-[#0a0a0a] border-t border-gray-900 py-12 text-center">
        <h2 className="font-vogue text-3xl text-dk-gold mb-6">D'KAIZEN</h2>
        <p className="text-gray-600 text-sm font-light">Bogotá, Colombia • Elevando el estándar</p>
        <p className="text-gray-700 text-xs mt-4">© 2026 D'Kaizen Barber Shop. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Home;