import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

function Agenda() {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. CARGA DE DATOS
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al cargar agenda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // --- LÓGICA DEL CALENDARIO ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Filtrar citas para el día seleccionado
  const appointmentsForSelectedDate = appointments.filter(app => {
    const appDate = new Date(app.appointment_date);
    return appDate.getDate() === selectedDate.getDate() &&
           appDate.getMonth() === selectedDate.getMonth() &&
           appDate.getFullYear() === selectedDate.getFullYear();
  });

  // Función para ver si un día tiene citas (para marcarlo en el calendario)
  const hasAppointments = (day) => {
    return appointments.some(app => {
      const appDate = new Date(app.appointment_date);
      return appDate.getDate() === day && appDate.getMonth() === month && appDate.getFullYear() === year;
    });
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/appointments/${id}`, { status: 'completed' });
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'completed' } : app));
    } catch (error) {
      alert("Error al completar");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pt-28 px-4 md:px-12 pb-12">
      
      {/* NAVEGACIÓN (Igual a la que ya tienes) */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 z-50">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400">Panel</Link>
        <Link to="/agenda" className="text-dk-red font-bold">Agenda</Link>
        <Link to="/staff" className="text-gray-400">Staff</Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-gray-500 ml-4 pl-4 border-l border-gray-800 hover:text-red-500">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-gray-900 pb-6">
          <div>
            <p className="text-dk-red uppercase tracking-widest text-xs font-bold mb-2">Calendario de Citas</p>
            <h1 className="text-4xl md:text-6xl font-light">Agenda <span className="font-vogue text-dk-gold italic">D'Kaizen</span></h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- COLUMNA IZQUIERDA: EL CALENDARIO --- */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-dk-gold hover:text-white">←</button>
              <h2 className="text-xl font-vogue text-white">{monthNames[month]} {year}</h2>
              <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-dk-gold hover:text-white">→</button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {daysOfWeek.map(d => <div key={d} className="text-[10px] uppercase text-gray-600 font-bold">{d}</div>)}
              
              {/* Espacios vacíos antes del día 1 */}
              {[...Array(firstDayOfMonth(year, month))].map((_, i) => <div key={i} />)}
              
              {/* Días del mes */}
              {[...Array(daysInMonth(year, month))].map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month;
                const active = hasAppointments(day);
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`relative h-10 w-10 flex items-center justify-center rounded-lg text-sm transition-all
                      ${isSelected ? 'bg-dk-gold text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}
                      ${active && !isSelected ? 'text-white' : ''}
                    `}
                  >
                    {day}
                    {active && (
                      <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-dk-gold shadow-[0_0_5px_#d4af37]'}`}></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-900">
               <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-dk-gold rounded-full"></div>
                  <span>Días con citas programadas</span>
               </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: DETALLE DEL DÍA --- */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light">
                Citas para el <span className="text-dk-gold font-vogue">{selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}</span>
              </h3>
              <p className="text-xs text-gray-500">{appointmentsForSelectedDate.length} turnos encontrados</p>
            </div>

            <div className="space-y-4">
              {appointmentsForSelectedDate.length > 0 ? (
                appointmentsForSelectedDate.map(cita => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    key={cita.id} 
                    className="bg-[#0a0a0a] border border-gray-900 p-5 rounded-xl flex justify-between items-center group hover:border-dk-gold/30 transition-all"
                  >
                    <div className="flex gap-5 items-center">
                      <div className="text-center border-r border-gray-800 pr-5">
                        <p className="text-2xl font-vogue text-white">
                          {new Date(cita.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <span className={`text-[9px] uppercase tracking-widest ${cita.status === 'completed' ? 'text-green-500' : 'text-dk-gold'}`}>
                          {cita.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-200">{cita.service?.name}</h4>
                        <p className="text-xs text-gray-500">
                          Cliente: <span className="text-gray-300">{cita.user?.name}</span> • 
                          Barbero: <span className="text-dk-gold">{cita.barber?.user?.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-dk-gold">${parseInt(cita.service?.price || 0).toLocaleString()}</span>
                      {cita.status !== 'completed' && (
                        <button 
                          onClick={() => handleComplete(cita.id)}
                          className="bg-transparent border border-dk-gold text-dk-gold text-[10px] px-3 py-1 uppercase tracking-widest hover:bg-dk-gold hover:text-black transition-all"
                        >
                          Completar
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-[#0a0a0a] border border-dashed border-gray-800 rounded-2xl text-gray-600">
                  <p>No hay citas para este día, bro. ¡Día de descanso! ☕</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Agenda;