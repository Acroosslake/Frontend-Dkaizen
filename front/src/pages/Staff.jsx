import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
// IMPORTAMOS TUS NUEVAS ALERTAS
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';

function Staff() {
  const navigate = useNavigate();
  
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Master Barber',
    contract_type: 'fijo',
    entry_time: '09:00',
    exit_time: '19:00',
    rh: 'O+',
    eps: 'EPS Genérica'
  });

  const fetchBarberos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/barbers');
      setBarberos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar barberos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarberos();
  }, []);

  // --- ELIMINAR CON CONFIRMACIÓN PRO ---
  const handleDelete = async (id) => {
    const result = await confirmAction(
      '¿DESPEDIR BARBERO?', 
      'Esta acción eliminará al barbero del equipo de D\'KAIZEN permanentemente.',
      'SÍ, ELIMINAR'
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/barbers/${id}`);
        setBarberos(barberos.filter(b => b.id !== id));
        successAlert('¡ELIMINADO!', 'El barbero ha sido removido del sistema.');
      } catch (error) {
        errorAlert('ERROR', 'No se pudo completar la solicitud de eliminación.');
      }
    }
  };

  // --- SUBMIT CON ALERTAS ELEGANTES ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        // ACTUALIZAR
        const res = await api.put(`/barbers/${editingBarber.id}`, formData);
        successAlert('¡ACTUALIZADO!', res.data.message || `El perfil de ${formData.name} ha sido guardado.`);
      } else {
        // CREAR NUEVO
        await api.post('/barbers', formData);
        successAlert('¡CONTRATADO!', `✂️ ${formData.name} ya es parte del equipo D'KAIZEN.`);
      }
      setShowModal(false);
      fetchBarberos();
    } catch (error) {
      console.error("DEBUG:", error.response?.data);
      const serverResponse = error.response?.data;
      
      if (serverResponse?.errors) {
        const messages = Object.values(serverResponse.errors).flat().join("\n");
        errorAlert('VALIDACIÓN FALLIDA', messages);
      } else {
        errorAlert('HUBO UN PROBLEMA', serverResponse?.message || serverResponse?.error || "Revisa los datos ingresados.");
      }
    }
  };

  const openModalForAdd = () => {
    setEditingBarber(null);
    setFormData({ name: '', specialty: 'Master Barber', contract_type: 'fijo', entry_time: '09:00', exit_time: '19:00', rh: 'O+', eps: 'Sura' });
    setShowModal(true);
  };

  const openModalForEdit = (barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.user?.name || '',
      specialty: barber.specialty || '',
      contract_type: barber.contract_type || 'fijo',
      entry_time: barber.entry_time || '09:00',
      exit_time: barber.exit_time || '18:00',
      rh: barber.rh || '',
      eps: barber.eps || ''
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-28 px-4 md:px-12 pb-12">
      
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Panel</Link>
        <Link to="/agenda" className="text-gray-400 hover:text-white transition-colors">Agenda</Link>
        <Link to="/staff" className="text-dk-red font-bold">Staff</Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-gray-500 pl-6 border-l border-gray-800 hover:text-red-500 transition-colors">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 border-b border-gray-900 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-dk-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Gestión de Personal</p>
            <h1 className="text-5xl md:text-7xl font-light text-gray-100 uppercase tracking-tighter">Nuestro <span className="font-vogue text-dk-gold italic">Staff</span></h1>
          </div>
          <button onClick={openModalForAdd} className="bg-dk-red hover:bg-red-800 text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(189,0,3,0.3)] hover:scale-105 active:scale-95 uppercase">
            + Incorporar Barbero
          </button>
        </motion.header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-vogue tracking-[0.5em] animate-pulse">RECONOCIENDO EQUIPO...</div>
        ) : (
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barberos.map((b) => (
              <motion.div key={b.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#0a0a0a] border border-gray-900 p-8 hover:border-dk-gold/30 transition-all group rounded-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => openModalForEdit(b)} className="p-2.5 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-dk-gold hover:text-black transition-all">✏️</button>
                  <button onClick={() => handleDelete(b.id)} className="p-2.5 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-dk-red transition-all">🗑️</button>
                </div>

                <div className="flex justify-between items-start mb-6 pt-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 shadow-inner group-hover:border-dk-gold/50 transition-colors">
                    <span className="text-2xl font-vogue text-dk-gold">{b.user?.name?.charAt(0) || '?'}</span>
                  </div>
                  <span className="text-[9px] tracking-[0.2em] text-green-500 uppercase bg-green-900/10 px-4 py-1.5 rounded-full border border-green-900/30 font-bold">
                    ACTIVO • {b.entry_time} - {b.exit_time}
                  </span>
                </div>
                
                <h2 className="text-2xl font-medium text-white mb-1 group-hover:text-dk-gold transition-colors tracking-tight">
                  {b.user?.name || 'Usuario D-Kaizen'}
                </h2>
                <p className="text-[10px] text-dk-gold tracking-[0.3em] uppercase mb-8 font-bold">{b.specialty}</p>
                
                <div className="space-y-3 text-[11px] text-gray-500 pt-6 border-t border-gray-900/50">
                  <div className="flex justify-between uppercase tracking-widest">RH / EPS: <span className="text-gray-100 font-bold">{b.rh || 'O+'} — {b.eps || 'Sura'}</span></div>
                  <div className="flex justify-between uppercase tracking-widest">Contrato: <span className="text-gray-100 font-bold capitalize">{b.contract_type}</span></div>
                </div>

                <div className="pt-8">
                  <Link 
                    to={`/agenda?barber_id=${b.id}`}
                    className="w-full bg-white/5 hover:bg-dk-gold text-gray-300 hover:text-black block text-center py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all border border-gray-800 hover:border-dk-gold font-bold shadow-lg"
                  >
                    Ver Agenda Personal ✂️
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[#0a0a0a] border border-gray-800 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dk-gold to-transparent opacity-50"></div>
              
              <h2 className="text-3xl font-vogue text-dk-gold mb-10 text-center tracking-widest">
                {editingBarber ? 'AJUSTAR PERFIL' : 'NUEVO CONTRATO'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-dk-red uppercase text-[9px] font-bold tracking-[0.3em] ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-white focus:border-dk-gold outline-none transition-all placeholder:text-gray-800 text-xs tracking-wider" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ej. Santiago Valencia" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-[0.3em] ml-1">Especialidad</label>
                    <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-[0.3em] ml-1">RH</label>
                    <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.rh} onChange={(e) => setFormData({...formData, rh: e.target.value})} maxLength="3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-[0.3em] ml-1">Entrada</label>
                    <input type="time" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.entry_time} onChange={(e) => setFormData({...formData, entry_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-[0.3em] ml-1">Salida</label>
                    <input type="time" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.exit_time} onChange={(e) => setFormData({...formData, exit_time: e.target.value})} />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-dk-gold text-black font-bold py-5 rounded-2xl hover:bg-white transition-all tracking-[0.3em] text-[10px] shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-95 uppercase">
                    {editingBarber ? 'Guardar Cambios' : 'Finalizar Registro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Staff;