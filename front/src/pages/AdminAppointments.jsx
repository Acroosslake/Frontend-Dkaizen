import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/admin/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-dk-dark min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-vogue text-dk-gold">Control de Reservas</h1>
        <p className="text-gray-400 text-sm">Gestiona las citas de D'Kaizen</p>
      </header>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dk-red/20 text-dk-gold uppercase text-xs tracking-widest border-b border-gray-800">
              <th className="px-6 py-4 font-bold">Cliente</th>
              <th className="px-6 py-4 font-bold">Servicio</th>
              <th className="px-6 py-4 font-bold">Barbero</th>
              <th className="px-6 py-4 font-bold">Fecha y Hora</th>
              <th className="px-6 py-4 font-bold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Cargando agenda...</td></tr>
            ) : appointments.length > 0 ? (
              appointments.map((app) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={app.id} className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{app.user?.name}</div>
                    <div className="text-xs text-gray-500">{app.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-dk-gold/10 text-dk-gold px-3 py-1 rounded-full text-xs border border-dk-gold/20">
                      {app.service?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {app.barber?.user?.name || 'No asignado'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(app.appointment_date).toLocaleString('es-CO', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase ${app.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {app.status || 'Pendiente'}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No hay reservas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;