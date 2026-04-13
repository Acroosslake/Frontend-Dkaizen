import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState({
    ingresos: 0,
    ingresosMes: 0, // ✅ Nuevo campo
    citas: 0,
    movimientos: [],
    grafica: []
  });

  // Extraemos la carga a una función reutilizable
  const fetchStats = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await api.get('/stats');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando el comando central:", error);
      setLoading(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = {
    labels: stats.grafica.map(d => d.fecha),
    datasets: [{
      label: 'Ingresos Diarios',
      data: stats.grafica.map(d => d.total),
      backgroundColor: '#D4AF37',
      borderRadius: 8,
      hoverBackgroundColor: '#FFFFFF',
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-dk-gold font-vogue tracking-[0.5em] animate-pulse uppercase">Sincronizando Comando Central...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-28 px-4 md:px-12 pb-12">
      
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-2xl"
      >
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-dk-red font-bold">Panel</Link>
        <Link to="/agenda" className="text-gray-400 hover:text-white transition-colors">Agenda</Link>
        <Link to="/staff" className="text-gray-400 hover:text-white transition-colors">Staff</Link>
        <Link to="/users" className="text-gray-400 hover:text-white transition-colors">Usuarios</Link>
        <button onClick={() => logout()} className="text-gray-500 hover:text-red-500 transition-colors pl-6 border-l border-gray-800 uppercase text-[10px] font-bold">Salir</button>
      </motion.nav>

      <div className="max-w-7xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 border-b border-dk-red/20 pb-8 flex justify-between items-end"
        >
          <div>
            <p className="text-dk-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4 ml-1">Comando Central</p>
            <h1 className="text-5xl md:text-7xl font-light">
              Visión <span className="font-vogue text-dk-gold italic">General</span>
            </h1>
          </div>

          {/* ✅ BOTÓN DE SINCRONIZACIÓN */}
          <button 
            onClick={fetchStats}
            disabled={isSyncing}
            className={`mb-2 p-4 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-dk-gold transition-all flex items-center gap-3 group ${isSyncing ? 'opacity-50' : ''}`}
          >
            <span className={`text-dk-gold text-lg ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>↻</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white font-bold hidden md:block">Sincronizar</span>
          </button>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          <motion.div variants={itemVariants} className="border-l border-gray-800 pl-6">
            <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-4">Ingresos Diarios</p>
            <p className="text-6xl md:text-7xl font-vogue text-white">
              ${(stats.ingresos / 1000).toFixed(1)}K
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="border-l border-gray-800 pl-6">
            <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-4">Citas Activas</p>
            <p className="text-6xl md:text-7xl font-vogue text-white">{stats.citas}</p>
          </motion.div>

          {/* ✅ CAMBIO: INGRESOS MENSUALES EN LUGAR DE ALERTAS */}
          <motion.div variants={itemVariants} className="border-l border-dk-gold/50 pl-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-dk-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-4">Ingresos Mensuales</p>
            <p className="text-6xl md:text-7xl font-vogue text-dk-gold">
              ${(stats.ingresosMes / 1000).toFixed(1)}K
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 shadow-2xl">
             <h2 className="text-xl font-light mb-8 flex items-center text-gray-200 uppercase tracking-tighter">
               <span className="w-8 h-px bg-dk-red mr-4"></span> Últimos Movimientos
             </h2>
             <div className="space-y-6">
                {stats.movimientos.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-900 hover:bg-white/[0.01] transition-all px-2 rounded-lg">
                    <div>
                      <p className="text-white font-bold text-sm">{item.corte}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.cliente} • {item.barber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-dk-gold font-bold">{item.precio}</p>
                      <p className="text-[9px] text-gray-600 uppercase">{item.hora}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button 
                onClick={() => navigate('/users')}
                className="w-full mt-10 py-4 text-[9px] uppercase tracking-[0.3em] text-dk-gold/60 hover:text-dk-gold border border-gray-900 hover:border-dk-gold/30 rounded-2xl transition-all font-black bg-black/40"
             >
                Gestionar Usuarios del Sistema →
             </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 shadow-2xl">
             <h2 className="text-xl font-light mb-10 flex items-center text-gray-200 uppercase tracking-tighter">
               <span className="w-8 h-px bg-dk-gold mr-4"></span> Rendimiento Semanal
             </h2>
             <div className="h-72">
                <Bar 
                  data={chartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: { 
                      y: { grid: { color: '#1a1a1a' }, ticks: { color: '#444', font: { size: 10 } } }, 
                      x: { grid: { display: false }, ticks: { color: '#444', font: { size: 10 } } } 
                    },
                    plugins: { legend: { display: false } }
                  }} 
                />
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;