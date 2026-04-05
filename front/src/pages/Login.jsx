// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
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

        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (err) {
        console.error("Error en backend al validar Google:", err);
        setError('Error al conectar tu cuenta de Google con nuestro servidor.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Se canceló el inicio de sesión con Google.');
    }
  });

  return (
    <div className="min-h-screen bg-dk-dark flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dk-red/20 via-dk-dark to-dk-dark opacity-50 z-0"></div>
      
      <div className="bg-[#222222] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-vogue text-dk-gold tracking-widest mb-2">D'KAIZEN</h2>
          <p className="text-gray-400 text-sm font-light">Acceso a tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg focus:outline-none focus:border-dk-red focus:ring-1 focus:ring-dk-red text-white transition-colors"
              placeholder="admin@dkaizen.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-700 rounded-lg focus:outline-none focus:border-dk-red focus:ring-1 focus:ring-dk-red text-white transition-colors"
              placeholder="••••••••"
            />
            {/* BOTÓN DE OLVIDÉ MI CONTRASEÑA */}
            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-dk-gold transition-colors font-bold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dk-red hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(189,0,3,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? 'Iniciando sesión...' : 'INGRESAR'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#222222] text-gray-500">O continuar con</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleGoogleLogin()}
              type="button"
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{' '}
          <Link to="/" className="text-dk-gold hover:text-yellow-400 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;