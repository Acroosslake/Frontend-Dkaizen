// src/pages/Agenda.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Agenda() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-28 px-4 md:px-12 pb-12">
      
      {/* MENÚ FLOTANTE */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-[0_10px_30px_rgba(189,0,3,0.15)]">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Panel</Link>
        <Link to="/agenda" className="text-dk-red font-bold transition">Agenda</Link>
        <Link to="/staff" className="text-gray-400 hover:text-white transition">Staff</Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition pl-6 border-l border-gray-800">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-gray-900 pb-8 flex justify-between items-end">
          <div>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">Gestión de Turnos</p>
            <h1 className="text-5xl md:text-7xl font-light text-gray-100">Citas <span className="font-vogue text-dk-gold italic">Activas</span></h1>
          </div>
          <button className="bg-dk-red hover:bg-red-800 text-white px-6 py-2 rounded-full text-sm tracking-widest transition shadow-[0_0_15px_rgba(189,0,3,0.3)]">+ NUEVA CITA</button>
        </motion.header>

        {/* LÍNEA DE TIEMPO ANIMADA */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 bg-[#0a0a0a] border border-gray-900 p-6 hover:border-dk-red/50 transition relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-dk-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
            <div className="md:w-32 border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 flex flex-col justify-center">
              <p className="text-3xl font-vogue text-white">14:00</p>
              <p className="text-xs text-dk-gold uppercase tracking-widest">En curso</p>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium text-gray-200">Corte Premium + Perfilado</h3>
              <p className="text-sm text-gray-400 mt-1">Cliente: Carlos Mendoza • Barbero: Julian V.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-dk-gold font-bold tracking-widest">$45,000</span>
              <button className="border border-dk-gold hover:bg-dk-gold text-dk-gold hover:text-black px-4 py-1 text-xs uppercase tracking-widest transition">Completar</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 bg-[#0a0a0a] border border-gray-900 p-6 hover:border-gray-700 transition relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-gray-800"></div>
            <div className="md:w-32 border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 flex flex-col justify-center">
              <p className="text-3xl font-vogue text-gray-400">15:30</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest">Próxima</p>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium text-gray-400">Combo D'Kaizen</h3>
              <p className="text-sm text-gray-500 mt-1">Cliente: Mateo Ruiz • Barbero: Alex R.</p>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <span className="text-gray-400 font-bold tracking-widest">$55,000</span>
              <button className="border border-gray-800 px-4 py-1 text-xs uppercase tracking-widest text-gray-500 cursor-not-allowed">Pendiente</button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

export default Agenda;