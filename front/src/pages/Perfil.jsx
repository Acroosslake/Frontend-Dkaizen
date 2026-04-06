import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function Perfil() {
  const { user, login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // 1. Enviamos solo los datos permitidos (el email es mejor no tocarlo)
      const response = await api.put('/user/update', {
        name: formData.name,
        phone: formData.phone
      });
      
      // 2. Refrescamos la sesión en el frontend si es necesario
      // Si tu backend no devuelve un nuevo token, usamos el que ya tenemos 
      // para disparar el efecto de recarga de datos del AuthContext
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        await login(currentToken);
      }

      setStatus({ type: 'success', msg: '¡Perfil actualizado, fiera!' });
    } catch (error) {
      console.error("Error detallado:", error.response);
      
      // Capturamos el mensaje de error real de Laravel (ej: si falla el 403 o validación)
      const errorMsg = error.response?.data?.message || 'Hubo un error al actualizar los datos.';
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans pb-20 relative">
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/servicios" className="hover:text-dk-gold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>
          <Link to={user?.role === 'admin' ? "/dashboard" : "/reservas"} className="text-xs uppercase tracking-widest text-dk-gold font-bold border border-dk-gold/30 px-4 py-1.5 rounded-full hover:bg-dk-gold hover:text-black transition">
            Volver
          </Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto mt-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-dk-red to-dk-gold rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-vogue shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-light">Mi <span className="font-vogue text-dk-gold italic">Perfil</span></h1>
          </div>

          {status.msg && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm ${status.type === 'success' ? 'bg-green-900/30 border border-green-500 text-green-200' : 'bg-red-900/30 border border-red-500 text-red-200'}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Nombre Completo</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-dk-gold outline-none transition" />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Correo Electrónico</label>
              <input type="email" value={formData.email} disabled className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-gray-600 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Teléfono / WhatsApp</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-dk-gold outline-none transition" placeholder="Ej: +57 300..." />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-dk-red hover:bg-red-800 text-white font-bold py-4 rounded-xl tracking-widest transition-all shadow-[0_0_15px_rgba(189,0,3,0.3)] disabled:opacity-50">
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default Perfil;