import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Servicios() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuServicios = [
    { id: 1, nombre: "Corte Premium", precio: "$35,000", desc: "Asesoría de imagen, lavado profundo, corte de precisión y peinado con productos de primera línea.", imagen: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000" },
    { id: 2, nombre: "Ritual de Barba", precio: "$25,000", desc: "Afeitado clásico a navaja, toalla caliente ozonizada, perfilado y aceites esenciales hidratantes.", imagen: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1000" },
    { id: 3, nombre: "Combo Master VIP", precio: "$55,000", desc: "La experiencia D'Kaizen definitiva. Corte Premium + Ritual de Barba + Masaje capilar relajante.", imagen: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" }
  ];

  const [activo, setActivo] = useState(menuServicios[0]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative flex flex-col overflow-x-hidden selection:bg-dk-gold selection:text-black">
      
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

      {/* 🌟 CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto w-full mt-28 md:mt-32 px-4 pb-12 flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* LADO IZQUIERDO: LISTA DE SERVICIOS */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="w-full lg:w-5/12 pt-4"
        >
          <p className="text-dk-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4">Nuestro Menú</p>
          <h1 className="text-5xl md:text-6xl font-light mb-12">Servicios de <span className="font-vogue text-dk-gold italic">Excelencia</span></h1>
          
          <div className="space-y-4 pr-4">
            {menuServicios.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setActivo(s)} 
                className={`cursor-pointer px-6 py-6 rounded-[2rem] border transition-all duration-300 group ${
                  activo.id === s.id 
                  ? 'bg-dk-gold/5 border-dk-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                  : 'bg-[#0a0a0a] border-gray-800/50 hover:bg-[#111] hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-bold transition-colors ${activo.id === s.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {s.nombre}
                  </h3>
                  <span className={`font-vogue text-xl transition-colors ${activo.id === s.id ? 'text-dk-gold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {s.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:text-left">
            <Link to="/" className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
              ← Regresar al inicio
            </Link>
          </div>
        </motion.div>

        {/* LADO DERECHO: VISUALIZADOR DEL SERVICIO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-7/12 lg:sticky lg:top-32 self-start"
        >
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
            
            {/* Contenedor de la Imagen */}
            <div className="h-96 md:h-[500px] overflow-hidden relative bg-black">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
              <img 
                key={activo.id} 
                src={activo.imagen} 
                className="w-full h-full object-cover animate-[fadeIn_0.6s_ease-out] group-hover:scale-105 transition-transform duration-1000" 
                alt={activo.nombre} 
              />
            </div>
            
            {/* Tarjeta de Información Superpuesta */}
            <div className="p-6 md:p-8 relative z-20 -mt-32">
              <div className="bg-[#030303]/80 backdrop-blur-2xl border border-gray-800/50 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                  <div>
                    <p className="text-dk-gold uppercase tracking-[0.3em] text-[9px] font-bold mb-2">Selección Actual</p>
                    <h2 className="text-3xl font-vogue text-white leading-none">{activo.nombre}</h2>
                  </div>
                  <span className="text-2xl font-black text-white bg-white/5 px-4 py-2 rounded-xl">{activo.precio}</span>
                </div>
                
                <p className="text-gray-400 mb-8 font-light text-sm leading-relaxed">
                  {activo.desc}
                </p>
                
                <Link to="/reservas" className="block w-full">
                  <button className="w-full bg-dk-red hover:bg-red-800 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(189,0,3,0.3)]">
                    AGENDAR ESTE SERVICIO
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </main>

      {/* Animación personalizada para el cambio de imagen */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { 
          from { opacity: 0; filter: blur(10px); } 
          to { opacity: 1; filter: blur(0px); } 
        }
      `}} />
    </div>
  );
}

export default Servicios;