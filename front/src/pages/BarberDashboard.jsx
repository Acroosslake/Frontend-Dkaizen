import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function BarberDashboard() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        // Gracias a tu backend, esta ruta solo devolverá los de este barbero
        const response = await api.get('/appointments');
        setTurnos(response.data);
      } catch (error) {
        console.error("Error al cargar la agenda del barbero:", error);
      }
    };
    fetchTurnos();
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera del Panel */}
        <div className="mb-10">
          <h1 className="text-3xl font-vogue text-dk-gold mb-2">Mi Agenda</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Tus próximos turnos asignados</p>
        </div>

        {/* Lista de Turnos */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6">
          {turnos.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No tienes turnos programados por ahora.</p>
          ) : (
            <div className="space-y-4">
              {turnos.map((turno) => (
                <div key={turno.id} className="flex justify-between items-center bg-[#111] p-5 rounded-2xl border border-gray-800 hover:border-dk-gold/50 transition-colors">
                  
                  {/* Info del Cliente */}
                  <div>
                    <p className="text-dk-gold text-xs uppercase tracking-widest font-bold mb-1">
                      {turno.appointment_date}
                    </p>
                    <h3 className="text-lg font-bold text-white">Cliente: {turno.user?.name}</h3>
                    <p className="text-gray-400 text-sm">{turno.service?.name || 'Servicio de Barbería'}</p>
                    {turno.notes && (
                      <p className="text-gray-500 text-xs italic mt-2">Nota: "{turno.notes}"</p>
                    )}
                  </div>

                  {/* Estado / Precio */}
                  <div className="text-right">
                    <span className="text-xl font-bold bg-white/5 px-4 py-2 rounded-lg block mb-2">
                      $ {Number(turno.total_price).toLocaleString('es-CO')}
                    </span>
                    <span className={`text-xs uppercase tracking-wider font-bold ${turno.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {turno.status === 'pending' ? 'PENDIENTE' : turno.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BarberDashboard;