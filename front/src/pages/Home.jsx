// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
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

      {/* SECCIÓN 2: CARACTERÍSTICAS */}
      <section className="relative z-10 bg-dk-dark py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-gold transition-colors duration-500">
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-xl font-vogue text-white mb-3">Master Barbers</h3>
            <p className="text-gray-400 font-light text-sm">Profesionales de élite entrenados para esculpir tu mejor versión con precisión quirúrgica.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-red transition-colors duration-500">
            <div className="text-4xl mb-4">🥃</div>
            <h3 className="text-xl font-vogue text-white mb-3">Zona VIP</h3>
            <p className="text-gray-400 font-light text-sm">Disfruta de una bebida de cortesía mientras esperas en nuestro lounge exclusivo.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="text-center p-6 border border-gray-800 rounded-2xl bg-[#111111] hover:border-dk-gold transition-colors duration-500">
            <div className="text-4xl mb-4">✂️</div>
            <h3 className="text-xl font-vogue text-white mb-3">Productos Premium</h3>
            <p className="text-gray-400 font-light text-sm">Utilizamos únicamente las mejores marcas internacionales para el cuidado de tu cabello y barba.</p>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 3: UBICACIÓN Y MAPA (NUEVA) */}
      <section className="relative z-10 bg-[#0a0a0a] py-24 px-4 border-t border-gray-900 border-b">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Encuéntranos</p>
            <h2 className="text-5xl font-light mb-8">Nuestra <span className="font-vogue text-dk-gold italic">Ubicación</span></h2>
            
            <div className="space-y-6 text-gray-400 font-light">
              <div className="flex items-start gap-4">
                <span className="text-dk-gold text-xl mt-1">📍</span>
                <div>
                  <h4 className="text-white font-medium text-lg">D'Kaizen Headquarters</h4>
                  <p>Zona T, Calle 85 # 12-34<br/>Bogotá, Colombia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-dk-gold text-xl mt-1">🕒</span>
                <div>
                  <h4 className="text-white font-medium text-lg">Horarios de Atención</h4>
                  <p>Lunes - Sábado: 10:00 AM - 8:00 PM<br/>Domingos: Cerrado</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-dk-gold text-xl mt-1">📱</span>
                <div>
                  <h4 className="text-white font-medium text-lg">Contacto Directo</h4>
                  <p>+57 300 123 4567<br/>reservas@dkaizen.co</p>
                </div>
              </div>
            </div>
            
            <Link to="/reservas" className="inline-block mt-8">
              <button className="bg-transparent border border-dk-red hover:bg-dk-red text-white py-3 px-8 rounded-full tracking-widest text-sm transition-colors duration-300">
                CÓMO LLEGAR
              </button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 h-[400px] rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
          >
            {/* iFrame de Google Maps (Modo oscuro aplicado por CSS nativo de Google) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15907.039641477759!2d-74.05389!3d4.6669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a5e8c1e8d6f%3A0x2a3e5c7a4b8a4f0!2sZona%20T%20Bogota!5e0!3m2!1sen!2sco!4v1650000000000!5m2!1sen!2sco" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(85%)" }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="relative z-10 bg-[#030303] py-12 text-center">
        <h2 className="font-vogue text-3xl text-dk-gold mb-6">D'KAIZEN</h2>
        <p className="text-gray-600 text-sm font-light">Bogotá, Colombia • Elevando el estándar</p>
        <p className="text-gray-700 text-xs mt-4">© 2026 D'Kaizen Barber Shop. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}

export default Home;