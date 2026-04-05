import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) return setStatus({ type: 'error', msg: "Passwords don't match, bro." });

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        email, token, password, password_confirmation: passwordConfirm
      });
      setStatus({ type: 'success', msg: 'Password updated! Redirecting...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Invalid or expired link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a0a0a] p-10 rounded-2xl border border-gray-900 w-full max-w-md">
        <h2 className="text-3xl font-vogue text-dk-gold text-center mb-8 uppercase tracking-widest">New Password</h2>
        {status.msg && <div className={`p-3 rounded-lg mb-6 text-sm text-center ${status.type === 'error' ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>{status.msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" placeholder="NEW PASSWORD" className="w-full px-4 py-4 bg-black border border-gray-800 rounded-xl text-white focus:border-dk-gold outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="CONFIRM PASSWORD" className="w-full px-4 py-4 bg-black border border-gray-900 rounded-xl text-white focus:border-dk-gold outline-none" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
          <button disabled={loading} className="w-full bg-dk-red py-4 rounded-xl font-bold hover:bg-red-700 transition-all">
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ResetPassword;