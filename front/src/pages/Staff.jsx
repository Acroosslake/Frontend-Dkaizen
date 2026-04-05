import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // IMPORTANTE: Asegúrate de tener axios instalado (npm install axios)

function Staff() {
  const navigate = useNavigate();
  
  // Memoria de React para guardar los datos del backend
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Conexión al backend de Laravel al cargar la página
  useEffect(() => {
    const fetchBarberos = async () => {
      try {
        // Ajusta esta URL si tu Codespace usa un enlace distinto
        const response = await axios.get('https://glorious-memory-97j4wrjxxr7jhp64p-8000.app.github.dev/api/barbers');
        // Laravel suele mandar los datos dentro de un objeto 'data'
        setBarberos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error conectando con la API:", error);
        setLoading(false);
      }
    };

    fetchBarberos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-28 px-4 md:px-12 pb-12">
      
      {/* MENÚ FLOTANTE */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-[0_10px_30px_rgba(189,0,3,0.15)]">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Panel</Link>
        <Link to="/agenda" className="text-gray-400 hover:text-white transition">Agenda</Link>
        <Link to="/staff" className="text-dk-red font-bold transition">Staff</Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition pl-6 border-l border-gray-800">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-gray-900 pb-8">
          <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Equipo de Trabajo</p>
          <h1 className="text-5xl md:text-7xl font-light text-gray-100">Nuestros <span className="font-vogue text-dk-gold italic">Barberos</span></h1>
        </motion.header>

        {/* RENDERIZADO DINÁMICO DESDE LARAVEL */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-dk-gold text-xl animate-pulse tracking-widest uppercase">Escaneando base de datos...</p>
          </div>
        ) : barberos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-900 rounded-xl">
            <p className="text-gray-500">No hay barberos registrados en el sistema todavía.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {barberos.map((barbero) => (
              <motion.div key={barbero.id} variants={cardVariants} className="bg-[#0a0a0a] border border-gray-900 p-8 hover:border-dk-red/30 transition group rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-dk-red/5 blur-2xl group-hover:bg-dk-red/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-16 h-16 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center overflow-hidden">
                     {/* Inicial del nombre */}
                     <span className="text-2xl font-vogue text-dk-gold">
                        {barbero.user?.name?.charAt(0) || '?'}
                     </span>
                  </div>
                  <span className="text-xs tracking-widest text-green-500 uppercase bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
                    ⏱️ {barbero.entry_time} - {barbero.exit_time}
                  </span>
                </div>
                
                <h2 className="text-2xl font-medium text-white mb-1 relative z-10">
                  {barbero.user?.name || 'Usuario Desconocido'}
                </h2>
                <p className="text-sm text-dk-gold tracking-widest uppercase mb-6 relative z-10">
                  Barbero Profesional
                </p>
                
                <div className="space-y-3 pt-6 border-t border-gray-900 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID de Sistema:</span>
                    <span className="text-white">#{barbero.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}

          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Staff;