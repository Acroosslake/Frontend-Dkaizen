import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

function Agenda() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al cargar la agenda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // FUNCIÓN CON EL TRUCO DE DEPURACIÓN
  const handleComplete = async (id) => {
    try {
      const response = await api.put(`/appointments/${id}`, { status: 'completed' });
      
      // Si llegamos aquí, fue un éxito
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'completed' } : app
      ));
      alert("¡Cita completada con éxito!");

    } catch (error) {
      console.error("Error completo capturado:", error);
      
      // EL TRUCO: Extraemos el mensaje real del servidor
      const mensajeError = error.response?.data?.message 
                           || error.response?.data?.error 
                           || "Error interno del servidor (500)";
      
      alert(`⚠️ Problema del Servidor: ${mensajeError}`);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "00:00";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return "00:00"; }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pt-28 px-4 md:px-12 pb-12">
      
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 md:gap-12 z-50 shadow-[0_10px_30px_rgba(189,0,3,0.15)]">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Panel</Link>
        <Link to="/agenda" className="text-dk-red font-bold transition">Agenda</Link>
        <Link to="/staff" className="text-gray-400 hover:text-white transition">Staff</Link>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition pl-6 border-l border-gray-800">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-900 pb-8 flex justify-between items-end">
          <div>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">Gestión de Turnos</p>
            <h1 className="text-5xl md:text-7xl font-light text-gray-100">Citas <span className="font-vogue text-dk-gold italic">Activas</span></h1>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 uppercase tracking-widest">Consultando agenda...</div>
        ) : (
          <div className="space-y-6">
            {appointments.length > 0 ? appointments.map((cita) => (
              <div key={cita.id} className="flex flex-col md:flex-row gap-6 bg-[#0a0a0a] border border-gray-900 p-6 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${cita.status === 'completed' ? 'bg-green-500' : 'bg-dk-gold'}`}></div>
                
                <div className="md:w-32 border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 flex flex-col justify-center">
                  <p className="text-3xl font-vogue text-white">{formatTime(cita.appointment_date)}</p>
                  <p className="text-[10px] uppercase text-dk-gold tracking-widest mt-1">{cita.status || 'pendiente'}</p>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-200">
                    {cita.service?.name || "Servicio no especificado"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Cliente: {cita.user?.name || "Anónimo"} • Barbero: {cita.barber?.user?.name || "No asignado"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-dk-gold font-bold tracking-widest">
                    ${cita.service?.price ? parseInt(cita.service.price).toLocaleString() : '0'}
                  </span>
                  
                  {cita.status !== 'completed' ? (
                    <button 
                      onClick={() => handleComplete(cita.id)}
                      className="border border-dk-gold hover:bg-dk-gold text-dk-gold hover:text-black px-4 py-1 text-xs uppercase tracking-widest transition"
                    >
                      Completar
                    </button>
                  ) : (
                    <div className="bg-green-500/10 text-green-500 px-4 py-1 text-xs uppercase border border-green-500/20">
                      Finalizada
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-gray-500 italic">No hay citas registradas.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Agenda;