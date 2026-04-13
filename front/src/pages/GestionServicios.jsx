import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';

function GestionServicios() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (e) { console.error("Error cargando el menú:", e); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      successAlert('¡MENÚ ACTUALIZADO!', 'El servicio se ha guardado con éxito.');
      setShowModal(false);
      fetchServices();
    } catch (e) { errorAlert('Error', 'No se pudo sincronizar el cambio.'); }
  };

  const handleDelete = async (id) => {
    const res = await confirmAction('¿Eliminar Servicio?', 'Esta acción quitará el corte del menú público.', 'Eliminar');
    if (res.isConfirmed) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (e) { errorAlert('Error', 'No se pudo eliminar.'); }
    }
  };

  // 🛡️ Clases base para los inputs
  const inputBase = "w-full bg-black/50 border border-gray-900 p-4 rounded-2xl text-sm outline-none focus:border-dk-gold transition-all";
  
  // ⚡ Clase específica para el PRECIO (Sin flechitas)
  const inputPriceClean = `${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-24 px-4 md:px-12 pb-12 overflow-hidden">
      
      {/* DECORACIÓN DE FONDO */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dk-gold/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER CON FLECHA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center w-12 h-12 rounded-full border border-gray-800 bg-black/50 hover:border-dk-gold transition-all duration-500">
              <span className="text-dk-gold group-hover:-translate-x-1 transition-transform text-xl">←</span>
            </button>
            <div>
              <p className="text-dk-red uppercase tracking-[0.4em] text-[10px] font-bold mb-1">Catálogo Premium</p>
              <h1 className="text-5xl md:text-6xl font-light">Gestión de <span className="font-vogue text-dk-gold italic">Cortes</span></h1>
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingService(null); setFormData({name:'', description:'', price:'', duration:''}); setShowModal(true); }}
            className="bg-dk-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:bg-white transition-all"
          >
            + Agregar Nuevo Combo
          </motion.button>
        </div>

        {/* GRID DE SERVICIOS */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={s.id}
              className="group relative bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] p-8 hover:border-dk-gold/40 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dk-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-1 px-bg bg-dk-red rounded-full shadow-[0_0_10px_rgba(189,0,3,0.5)]"></div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{s.duration} MIN</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-dk-gold transition-colors">{s.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed h-10">{s.description || 'Experiencia completa de barbería.'}</p>
                <div className="flex items-end justify-between border-t border-gray-900 pt-6">
                  <div>
                    <p className="text-[9px] text-gray-600 uppercase font-black mb-1">Precio Servicio</p>
                    <p className="text-3xl font-vogue text-white">${Number(s.price).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingService(s); setFormData(s); setShowModal(true); }} className="p-3 bg-gray-900/50 rounded-xl text-gray-400 hover:text-dk-gold transition-all">✎</button>
                    <button onClick={() => handleDelete(s.id)} className="p-3 bg-gray-900/50 rounded-xl text-gray-400 hover:text-red-500 transition-all">✕</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0a0a0a] border border-gray-800 p-8 md:p-12 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-dk-gold"></div>
              <h2 className="text-3xl font-vogue text-dk-gold mb-10 text-center uppercase tracking-[0.2em]">
                {editingService ? 'Refinar' : 'Nuevo'} <span className="text-white italic">Servicio</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="Nombre del Combo" required className={inputBase} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <textarea rows="3" placeholder="Descripción Detallada" className={inputBase} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block">Precio ($)</label>
                    {/* ✅ PRECIO: LIMPIO (SIN FLECHITAS) */}
                    <input type="number" required className={inputPriceClean} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block">Duración (min)</label>
                    {/* ✅ DURACIÓN: CON FLECHITAS (NORMAL) */}
                    <input type="number" required className={inputBase} value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full bg-dk-gold text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest mt-6 hover:bg-white transition-all shadow-xl">
                  {editingService ? 'Actualizar Menú' : 'Confirmar Nuevo Servicio'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GestionServicios;