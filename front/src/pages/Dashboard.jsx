import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // <-- Importamos el cerebro

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // <-- Extraemos la función oficial de salida

  const handleLogout = () => {
    logout(); // <-- Esto borra el token, limpia el estado y te manda al login
  };

  // Variantes para escalonar las animaciones de las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-28 px-4 md:px-12 pb-12">
      
      {/* MENÚ FLOTANTE SUPERIOR (DOCK.) */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-[0_10px_30px_rgba(189,0,3,0.15)]"
      >
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">
          D'KAIZEN
        </div>
        <Link to="/dashboard" className="text-dk-red font-bold transition">Panel</Link>
        <Link to="/agenda" className="text-gray-400 hover:text-white transition">Agenda</Link>
        <Link to="/staff" className="text-gray-400 hover:text-white transition">Staff</Link>
        <Link to="/users" className="text-gray-400 hover:text-white transition-colors">Usuarios</Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition pl-6 border-l border-gray-800">
          Salir
        </button>
      </motion.nav>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER MINIMALISTA */}
        <motion.header 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-dk-red/20 pb-8 flex justify-between items-end"
        >
          <div>
            <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Comando Central</p>
            <h1 className="text-5xl md:text-7xl font-light text-gray-100">Visión <span className="font-vogue text-dk-gold italic">General</span></h1>
          </div>
        </motion.header>

        {/* NÚMEROS GIGANTES ANIMADOS EN CASCADA */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          <motion.div variants={itemVariants} className="border-l border-gray-800 pl-6">
            <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">Ingresos Diarios</p>
            <p className="text-6xl md:text-7xl font-vogue text-white">$125K</p>
          </motion.div>
          <motion.div variants={itemVariants} className="border-l border-gray-800 pl-6">
            <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">Citas Activas</p>
            <p className="text-6xl md:text-7xl font-vogue text-white">18</p>
          </motion.div>
          <motion.div variants={itemVariants} className="border-l border-dk-red/50 pl-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-dk-red shadow-[0_0_10px_rgba(189,0,3,0.8)]"></div>
            <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">Alertas de Staff</p>
            <p className="text-6xl md:text-7xl font-vogue text-red-500">02</p>
          </motion.div>
        </motion.div>

        {/* SECCIÓN DE DATOS (Para llenar el vacío) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Actividad Reciente */}
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8">
             <h2 className="text-xl font-light mb-6 flex items-center text-gray-200">
               <span className="w-6 h-px bg-dk-red mr-4"></span> Últimos Movimientos
             </h2>
             <div className="space-y-4">
               {[
                 { id: 1, corte: "Corte Premium", cliente: "Mario Santos", barbero: "Julian V.", precio: "$35,000", hora: "Hace 10 min" },
                 { id: 2, corte: "Ritual de Barba", cliente: "David Silva", barbero: "Alex R.", precio: "$25,000", hora: "Hace 1 hora" },
                 { id: 3, corte: "Combo Master", cliente: "Andrés B.", barbero: "Julian V.", precio: "$55,000", hora: "Hace 3 horas" }
               ].map((item) => (
                 <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-900 hover:border-gray-700 transition">
                   <div>
                     <p className="text-white font-medium">{item.corte}</p>
                     <p className="text-xs text-gray-500">Cliente: {item.cliente} • {item.barbero}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-dk-gold font-bold">{item.precio}</p>
                     <p className="text-xs text-gray-600">{item.hora}</p>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-6 py-3 text-xs uppercase tracking-widest text-gray-500 hover:text-white border border-gray-900 hover:border-gray-700 rounded-lg transition">Ver Historial Completo</button>
          </div>

          {/* Gráfica Placeholder (Futura data de Laravel) */}
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-light mb-2 flex items-center text-gray-200">
                <span className="w-6 h-px bg-dk-gold mr-4"></span> Rendimiento Semanal
              </h2>
              <p className="text-gray-500 text-sm">Aquí conectaremos la gráfica de ingresos con Chart.js y Laravel.</p>
            </div>
            
            <div className="h-48 w-full border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center mt-6">
               <div className="text-center">
                 <span className="text-4xl">📈</span>
                 <p className="text-gray-600 mt-2 text-sm uppercase tracking-widest">Esperando Datos API</p>
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Dashboard;