import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: email,
        password: password
      });

      await login(response.data.token);
      
      const userRole = response.data.user.role;
      if (userRole === 'admin') {
          navigate('/dashboard');
      } else {
          navigate('/reservas'); 
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
          token: tokenResponse.access_token
        });

        await login(response.data.token);
        
        const userRole = response.data.user.role;
        if (userRole === 'admin') {
            navigate('/dashboard');
        } else {
            navigate('/reservas'); 
        }

      } catch (err) {
        console.error("Error en backend al validar Google:", err);
        setError('Error al conectar tu cuenta de Google con nuestro servidor.');
      } finally {
        setLoading(false); 
      }
    },
    onError: () => {
      setError('Se canceló el inicio de sesión con Google.');
    }
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex items-center justify-center px-4 relative overflow-hidden selection:bg-dk-gold selection:text-black py-10">
      
      {/* 🌟 IMAGEN DE FONDO ATMOSFÉRICA */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-[#030303]/40"></div>
        {/* Luces sutiles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dk-red/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-dk-gold/5 blur-[120px] rounded-full"></div>
      </div>

      {/* 🌟 CONTENEDOR DEL FORMULARIO (GLASSMORPHISM) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md border border-gray-800/50 my-auto"
      >
        <div className="text-center mb-10">
          <p className="text-dk-red uppercase tracking-[0.4em] text-[9px] font-bold mb-3">Bienvenido de vuelta</p>
          <h2 className="text-5xl font-vogue text-dk-gold tracking-widest drop-shadow-lg">D'KAIZEN</h2>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-2xl mb-6 text-xs text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2 ml-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-[#111111] border border-gray-800 rounded-2xl focus:outline-none focus:border-dk-gold text-sm text-white transition-all placeholder-gray-700"
              placeholder="admin@dkaizen.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2 ml-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-[#111111] border border-gray-800 rounded-2xl focus:outline-none focus:border-dk-gold text-sm text-white transition-all placeholder-gray-700"
              placeholder="••••••••"
            />
            <div className="flex justify-end mt-3 mr-2">
              <Link 
                to="/forgot-password" 
                className="text-[9px] uppercase tracking-[0.2em] text-gray-500 hover:text-dk-gold transition-colors font-bold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dk-red hover:bg-red-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_20px_rgba(189,0,3,0.3)] disabled:opacity-50 mt-4 transform hover:scale-[1.02]"
          >
            {loading ? 'AUTENTICANDO...' : 'INGRESAR'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.2em] font-bold">
              <span className="px-4 bg-[#0a0a0a] text-gray-600">Acceso Rápido</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => handleGoogleLogin()}
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-200 text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl disabled:opacity-50 transform hover:scale-[1.02]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>

        {/* ✅ AQUÍ ESTÁ EL BOTÓN DE CREAR CUENTA NUEVO */}
        <div className="mt-8 text-center flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-dk-gold hover:text-white font-bold transition-colors">
              Regístrate aquí
            </Link>
          </p>
          <Link to="/" className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-600 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 inline-block mx-auto">
            ← Regresar al inicio
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default Login;