import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
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
    email: '',
    phone: '',
    status: true,
    contract_type: 'fijo',
    entry_time: '09:00',
    exit_time: '19:00',
    rh: 'O+',
    eps: 'Sura'
  });

  const fetchBarberos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/barbers');
      setBarberos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchBarberos(); }, []);

  const handleDelete = async (id) => {
    const result = await confirmAction('¿DESPEDIR BARBERO?', 'Esta acción es permanente.', 'SÍ, ELIMINAR');
    if (result.isConfirmed) {
      try {
        await api.delete(`/barbers/${id}`);
        setBarberos(barberos.filter(b => b.id !== id));
        successAlert('¡ELIMINADO!', 'El staff ha sido actualizado.');
      } catch (error) { errorAlert('ERROR', 'No se pudo eliminar.'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        await api.put(`/barbers/${editingBarber.id}`, formData);
        successAlert('¡ACTUALIZADO!', 'Perfil guardado con éxito.');
      } else {
        await api.post('/barbers', formData);
        successAlert('¡CONTRATADO!', 'Nuevo barbero incorporado.');
      }
      setShowModal(false);
      fetchBarberos();
    } catch (error) {
      const serverResponse = error.response?.data;
      errorAlert('ERROR', serverResponse?.message || "Revisa los datos.");
    }
  };

  // ACTUALIZADO: Limpia todos los campos nuevos
  const openModalForAdd = () => {
    setEditingBarber(null);
    setFormData({ 
      name: '', specialty: 'Master Barber', email: '', phone: '', status: true,
      contract_type: 'fijo', entry_time: '09:00', exit_time: '19:00', rh: 'O+', eps: 'Sura' 
    });
    setShowModal(true);
  };

  // ACTUALIZADO: Carga los datos existentes
  const openModalForEdit = (barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.user?.name || '',
      specialty: barber.specialty || '',
      email: barber.email || '',
      phone: barber.phone || '',
      status: barber.status ?? true,
      contract_type: barber.contract_type || 'fijo',
      entry_time: barber.entry_time || '09:00',
      exit_time: barber.exit_time || '18:00',
      rh: barber.rh || '',
      eps: barber.eps || ''
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pt-28 px-4 md:px-12 pb-12">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-12 z-50">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400">Panel</Link>
        <Link to="/agenda" className="text-gray-400">Agenda</Link>
        <Link to="/staff" className="text-dk-red font-bold">Staff</Link>
        <Link to="/users" className="text-gray-400 hover:text-white transition-colors">Usuarios</Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-gray-500 hover:text-red-500">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-900 pb-8 flex justify-between items-end">
          <div>
            <p className="text-dk-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Gestión</p>
            <h1 className="text-5xl md:text-7xl font-light uppercase">Nuestro <span className="font-vogue text-dk-gold italic">Staff</span></h1>
          </div>
          <button onClick={openModalForAdd} className="bg-dk-red hover:bg-red-800 px-8 py-4 rounded-full text-[10px] font-bold tracking-widest shadow-lg">
            + INCORPORAR BARBERO
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-vogue tracking-[0.5em]">CARGANDO...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barberos.map((b) => (
              <div key={b.id} className="bg-[#0a0a0a] border border-gray-900 p-8 rounded-2xl group relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => openModalForEdit(b)} className="p-2.5 bg-gray-900 rounded-xl hover:bg-dk-gold hover:text-black transition-all">✏️</button>
                  <button onClick={() => handleDelete(b.id)} className="p-2.5 bg-gray-900 rounded-xl hover:bg-dk-red transition-all">🗑️</button>
                </div>
                
                <div className="flex justify-between items-start mb-6 pt-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-dk-gold/20">
                    <span className="text-2xl font-vogue text-dk-gold">{b.user?.name?.charAt(0)}</span>
                  </div>
                  {/* BADGE DE ESTADO DINÁMICO */}
                  <span className={`text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-full border font-bold ${b.status ? 'text-green-500 border-green-900/50 bg-green-900/10' : 'text-gray-500 border-gray-800 bg-gray-800/20'}`}>
                    {b.status ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>

                <h2 className="text-2xl font-medium mb-1 group-hover:text-dk-gold transition-colors">{b.user?.name}</h2>
                <p className="text-[10px] text-dk-gold tracking-[0.3em] uppercase mb-6 font-bold">{b.specialty}</p>

                <div className="space-y-2 text-[11px] text-gray-500 pt-5 border-t border-gray-900">
                   <div className="flex justify-between">Correo: <span className="text-white">{b.email || 'N/A'}</span></div>
                   <div className="flex justify-between">Teléfono: <span className="text-white">{b.phone || 'N/A'}</span></div>
                   <div className="flex justify-between">Horario: <span className="text-white">{b.entry_time} - {b.exit_time}</span></div>
                </div>

                <Link to={b.status ? `/agenda?barber_id=${b.id}` : '#'} 
                  className={`mt-6 w-full block text-center py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${b.status ? 'border-gray-800 hover:border-dk-gold hover:bg-dk-gold hover:text-black' : 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'}`}>
                  {b.status ? 'Ver Agenda ✂️' : 'No disponible'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[#0a0a0a] border border-gray-800 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
              <h2 className="text-3xl font-vogue text-dk-gold mb-10 text-center tracking-widest uppercase">{editingBarber ? 'Editar Barbero' : 'Nuevo Contrato'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-dk-red uppercase text-[9px] font-bold tracking-widest ml-1">Nombre Completo</label>
                  <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-white focus:border-dk-gold outline-none text-xs" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-500 uppercase text-[9px] font-bold tracking-widest">Correo</label>
                    <input type="email" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold" 
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@dkaizen.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-500 uppercase text-[9px] font-bold tracking-widest">Teléfono</label>
                    <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold" 
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="300..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-widest">Especialidad</label>
                    <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-widest">RH</label>
                    <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold" value={formData.rh} onChange={(e) => setFormData({...formData, rh: e.target.value})} maxLength="3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-widest">Entrada</label>
                    <input type="time" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none" value={formData.entry_time} onChange={(e) => setFormData({...formData, entry_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-600 uppercase text-[9px] font-bold tracking-widest">Salida</label>
                    <input type="time" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none" value={formData.exit_time} onChange={(e) => setFormData({...formData, exit_time: e.target.value})} />
                  </div>
                </div>

                {/* SWITCH DE ESTADO INTEGRADO AL FORM */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-gray-800">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Estado</span>
                  <button type="button" onClick={() => setFormData({...formData, status: !formData.status})}
                    className={`px-6 py-2 rounded-full text-[9px] font-bold transition-all ${formData.status ? 'bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'bg-gray-700'}`}>
                    {formData.status ? 'ACTIVO' : 'INACTIVO'}
                  </button>
                </div>

                <button type="submit" className="w-full bg-dk-gold text-black font-bold py-5 rounded-2xl hover:bg-white transition-all tracking-[0.3em] text-[10px] uppercase">
                  {editingBarber ? 'Guardar Cambios' : 'Confirmar Contrato'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Staff;