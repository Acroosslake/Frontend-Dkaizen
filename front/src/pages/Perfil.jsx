import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

function Perfil() {
  const { user, login } = useContext(AuthContext); // Usamos 'login' para refrescar los datos del usuario
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '' // Si tienes este campo en tu DB
  });
  
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // Cargar datos del usuario al entrar
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
      // 1. Enviamos los datos a Laravel
      const response = await api.put('/user/update', formData);
      
      // 2. IMPORTANTE: Actualizamos el AuthContext con el nuevo token/usuario
      // Si tu backend devuelve un nuevo token o solo el usuario, asegúrate de procesarlo.
      // Aquí asumimos que refrescamos la sesión para que el nombre cambie en el Navbar:
      if (response.data.token) {
        await login(response.data.token);
      }

      setStatus({ type: 'success', msg: '¡Perfil actualizado con éxito, fiera!' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Hubo un error al actualizar los datos.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans pb-20 relative">
      
      {/* NAVBAR (Reutilizamos el de Reservas/Home) */}
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-dk-red to-dk-gold rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-vogue shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-light">Mi <span className="font-vogue text-dk-gold italic">Perfil</span></h1>
            <p className="text-gray-500 text-sm mt-2">Gestiona tus datos personales</p>
          </div>

          {status.msg && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm ${status.type === 'success' ? 'bg-green-900/30 border border-green-500 text-green-200' : 'bg-red-900/30 border border-red-500 text-red-200'}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Nombre Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-dk-gold outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={formData.email}
                disabled // El email es mejor dejarlo fijo por seguridad
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-gray-600 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-600 mt-1 italic">* El correo no se puede modificar.</p>
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Teléfono / WhatsApp</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus:border-dk-gold outline-none transition"
                placeholder="Ej: +57 300..."
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-dk-red hover:bg-red-800 text-white font-bold py-4 rounded-xl tracking-widest transition-all shadow-[0_0_15px_rgba(189,0,3,0.3)] disabled:opacity-50"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default Perfil;