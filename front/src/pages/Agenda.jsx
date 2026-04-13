import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { successAlert, errorAlert } from '../utils/alerts';

function Agenda() {
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- ESTADOS PARA LA SANCIÓN ---
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [penaltyAmount, setPenaltyAmount] = useState(15000); // Valor sugerido

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const handleComplete = async (id) => {
    try {
      await api.put(`/appointments/${id}`, { status: 'completed' });
      successAlert('¡ÉXITO!', 'Servicio finalizado correctamente');
      fetchAppointments();
    } catch (error) { errorAlert('Error', 'No se pudo completar'); }
  };

  const handleNoShowSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${selectedApp.id}/no-show`, { 
        penalty_fee: penaltyAmount 
      });
      successAlert('REPORTADO', 'El recargo ha sido cargado a la cuenta del cliente');
      setShowNoShowModal(false);
      fetchAppointments();
    } catch (error) { errorAlert('Error', 'No se pudo procesar la inasistencia'); }
  };

  // --- LÓGICA DEL CALENDARIO ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const appointmentsForSelectedDate = appointments.filter(app => {
    const appDate = new Date(app.appointment_date);
    return appDate.getDate() === selectedDate.getDate() &&
           appDate.getMonth() === selectedDate.getMonth() &&
           appDate.getFullYear() === selectedDate.getFullYear();
  });

  const hasAppointments = (day) => {
    return appointments.some(app => {
      const appDate = new Date(app.appointment_date);
      return appDate.getDate() === day && appDate.getMonth() === month && appDate.getFullYear() === year;
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pt-28 px-4 md:px-12 pb-12">
      
      {/* NAV */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-dk-red/30 px-8 py-4 rounded-full flex items-center gap-8 z-50 shadow-2xl">
        <div className="text-2xl font-vogue text-dk-gold pr-6 border-r border-gray-800 hidden md:block">D'KAIZEN</div>
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Panel</Link>
        <Link to="/agenda" className="text-dk-red font-bold">Agenda</Link>
        <Link to="/staff" className="text-gray-400 hover:text-white transition">Staff</Link>
        <Link to="/users" className="text-gray-400 hover:text-white transition">Usuarios</Link>
        <Link to="/gestion-servicios" className="text-gray-400 hover:text-white transition-colors">Cortes</Link>
        <Link to="/inventory" className="text-gray-400 hover:text-white transition-colors">Almacén</Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-gray-500 ml-4 pl-4 border-l border-gray-800 hover:text-red-500 transition">Salir</button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end border-b border-gray-900 pb-6">
          <div>
            <p className="text-dk-red uppercase tracking-widest text-[10px] font-bold mb-2">Gestión de Turnos</p>
            <h1 className="text-4xl md:text-6xl font-light">Agenda <span className="font-vogue text-dk-gold italic">D'Kaizen</span></h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* CALENDARIO */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-dk-gold text-xl">←</button>
              <h2 className="text-xl font-vogue text-white">{monthNames[month]} {year}</h2>
              <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-dk-gold text-xl">→</button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center mb-4 text-[10px] uppercase text-gray-600 font-bold">
              {daysOfWeek.map(d => <div key={d}>{d}</div>)}
              {[...Array(firstDayOfMonth(year, month))].map((_, i) => <div key={i} />)}
              {[...Array(daysInMonth(year, month))].map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month;
                const active = hasAppointments(day);
                return (
                  <button key={day} onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`relative h-10 w-10 flex items-center justify-center rounded-xl text-sm transition-all
                      ${isSelected ? 'bg-dk-gold text-black font-black' : 'hover:bg-gray-800 text-gray-400'}
                    `}
                  >
                    {day}
                    {active && <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-dk-gold shadow-[0_0_5px_#d4af37]'}`}></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LISTA DE CITAS */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {appointmentsForSelectedDate.length > 0 ? (
                appointmentsForSelectedDate.map(cita => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={cita.id} 
                    className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-2xl flex justify-between items-center group hover:border-dk-gold/20 transition-all"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="text-center border-r border-gray-800 pr-6">
                        <p className="text-2xl font-vogue text-white">{new Date(cita.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <span className={`text-[8px] uppercase font-bold tracking-[0.2em] ${cita.status === 'completed' ? 'text-green-500' : cita.status === 'no-show' ? 'text-red-600' : 'text-dk-gold'}`}>
                          {cita.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-200">{cita.service?.name}</h4>
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                Cliente: <span className="text-gray-300 font-bold">{cita.user?.name}</span> • Barbero: <span className="text-dk-gold">{cita.barber?.user?.name}</span>
                            </p>
                            {/* ALERTA DE RECARGO PREVIO */}
                            {cita.user?.penalty_fee > 0 && (
                                <p className="text-[9px] text-dk-red font-bold flex items-center gap-1">
                                    ⚠️ DEUDA PENDIENTE: ${Number(cita.user.penalty_fee).toLocaleString()}
                                </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-dk-gold text-lg">${parseInt(cita.service?.price || 0).toLocaleString()}</span>
                      {cita.status !== 'completed' && cita.status !== 'no-show' && (
                        <div className="flex gap-2">
                            <button onClick={() => handleComplete(cita.id)} 
                                className="bg-dk-gold text-black text-[9px] font-black px-4 py-2 uppercase rounded-lg hover:bg-white transition-all">
                                Completar
                            </button>
                            <button onClick={() => { setSelectedApp(cita); setShowNoShowModal(true); }}
                                className="bg-transparent border border-red-900 text-red-600 text-[9px] font-black px-4 py-2 uppercase rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                No Asistió
                            </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-[#0a0a0a] border border-dashed border-gray-800 rounded-2xl text-gray-600 uppercase tracking-[0.3em] text-xs">
                  Sin citas para este día
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL DE RECARGO POR INASISTENCIA --- */}
      <AnimatePresence>
        {showNoShowModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNoShowModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#0a0a0a] border border-red-900/30 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
              <h2 className="text-xl font-vogue text-dk-red mb-4 text-center">REPORTE DE INCUMPLIMIENTO</h2>
              <p className="text-[10px] text-center text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">
                El cliente <span className="text-white font-bold">{selectedApp?.user?.name}</span> no se presentó. <br/> ¿Deseas aplicar un recargo para su próxima visita?
              </p>
              
              <form onSubmit={handleNoShowSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                  <label className="text-[9px] uppercase tracking-widest text-gray-600">Monto de la multa ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-black border border-gray-800 p-4 rounded-xl text-center text-xl font-vogue text-dk-gold outline-none focus:border-dk-gold transition-all"
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowNoShowModal(false)} className="flex-1 text-[10px] font-bold uppercase py-4 border border-gray-800 rounded-xl hover:bg-white hover:text-black transition-all">Ignorar</button>
                  <button type="submit" className="flex-1 bg-red-600 text-white text-[10px] font-bold uppercase py-4 rounded-xl shadow-lg shadow-red-600/20">Aplicar Multa</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Agenda;