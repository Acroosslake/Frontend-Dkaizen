import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, { email });
      setMessage('Link enviado, revisa tu correo bro.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Correo no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-dk-red/10 blur-[120px] rounded-full z-0"></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-900 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-vogue text-dk-gold tracking-widest mb-4 uppercase">Olvido de contraseña</h2>
          <p className="text-gray-500 text-sm font-light">Ingresa tu correo para recibir las intrucciones.</p>
        </div>
        {message && <div className="bg-green-900/20 border border-green-800 text-green-400 p-3 rounded-lg mb-6 text-sm text-center">{message}</div>}
        {error && <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-4 bg-black border border-gray-800 rounded-xl text-white focus:border-dk-gold outline-none transition-all" placeholder="your@email.com" />
          <button disabled={loading} className="w-full bg-dk-red hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
            {loading ? 'ENVIANDO...' : 'ENVIAR LINK DE REINICIO'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/login" className="text-gray-500 hover:text-dk-gold text-xs tracking-widest uppercase font-bold transition-colors">← volver al Login</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;