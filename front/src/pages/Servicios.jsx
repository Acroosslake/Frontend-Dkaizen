import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Servicios() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuServicios = [
    { id: 1, nombre: "Corte Premium", precio: "$35,000", desc: "Asesoría de imagen y ritual completo.", imagen: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000" },
    { id: 2, nombre: "Ritual de Barba", precio: "$25,000", desc: "Afeitado clásico a navaja.", imagen: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1000" },
    { id: 3, nombre: "Combo Master VIP", precio: "$55,000", desc: "Experiencia D'Kaizen definitiva.", imagen: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" }
  ];

  const [activo, setActivo] = useState(menuServicios[0]);

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans relative flex flex-col">
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/servicios" className="text-dk-gold font-bold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>

          {user ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 bg-dk-dark hover:bg-black px-4 py-1.5 rounded-full border border-dk-gold/50 transition-colors">
                <span className="text-sm font-bold text-dk-gold">Hola, {user.name ? user.name.split(' ')[0] : 'Jefe'}</span>
                <svg className={`w-4 h-4 text-dk-gold transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-3 w-48 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                    {user.role === 'admin' && <Link to="/dashboard" className="block px-4 py-2 text-sm text-dk-gold font-bold hover:bg-gray-800 transition-colors">Panel Admin</Link>}
                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-dk-red hover:text-white transition-colors">Mi Perfil</Link>
                    <div className="border-t border-gray-800 my-1"></div>
                    <button onClick={() => { setIsMenuOpen(false); logout(); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium">Cerrar Sesión</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="bg-black/40 px-4 py-1.5 rounded-full hover:bg-black/60 transition text-sm">Iniciar Sesión</Link>
          )}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full mt-12 px-4 pb-12 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-5/12 pt-8">
          <h1 className="text-5xl font-light mb-10">Servicios de <span className="font-vogue text-dk-gold italic">Excelencia</span></h1>
          <div className="space-y-2">
            {menuServicios.map((s) => (
              <div key={s.id} onClick={() => setActivo(s)} className={`cursor-pointer px-6 py-5 rounded-2xl border-l-4 transition-all ${activo.id === s.id ? 'bg-[#1a1a1a] border-dk-gold shadow-lg' : 'border-transparent hover:bg-[#111111]'}`}>
                <div className="flex justify-between items-center"><h3 className={`text-xl font-vogue ${activo.id === s.id ? 'text-dk-gold' : 'text-gray-300'}`}>{s.nombre}</h3><span className="font-bold text-white">{s.precio}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-7/12 sticky top-32">
          <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="h-80 md:h-[450px] overflow-hidden relative">
              <img key={activo.id} src={activo.imagen} className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-in-out]" alt={activo.nombre} />
            </div>
            <div className="p-8 relative z-20 -mt-20">
              <div className="bg-dk-dark/90 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
                <div className="flex justify-between items-end mb-4"><h2 className="text-3xl font-vogue text-white">{activo.nombre}</h2><span className="text-2xl font-bold text-dk-gold">{activo.precio}</span></div>
                <p className="text-gray-400 mb-8 font-light">{activo.desc}</p>
                <Link to="/reservas" className="w-full"><button className="w-full bg-dk-red hover:bg-red-800 text-white font-bold py-4 rounded-xl tracking-widest transition-all">AGENDAR ESTE SERVICIO</button></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }`}} />
    </div>
  );
}

export default Servicios;