import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 🌟 Importamos tu cerebro de autenticación

function Users() {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useContext(AuthContext); // 🌟 Usamos el usuario global
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'client' });

  // 1. OBTENER USUARIOS
  const fetchData = async () => {
    try {
      const resUsers = await api.get('/users');
      setUsers(resUsers.data);
      setLoading(false);
    } catch (e) {
      console.error("Error de sincronización:", e);
      // 🛡️ Si el token es inválido o expiró (Error 401), lo deslogueamos por seguridad
      if (e.response?.status === 401) {
         logout();
      } else {
         errorAlert('Error de Conexión', 'No se pudo cargar la lista de usuarios.');
      }
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. ACTUALIZAR USUARIO
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${editingUser.id}`, formData);
      await successAlert('¡ACTUALIZADO!', res.data.message || 'Los cambios se guardaron correctamente.');
      setEditingUser(null);
      fetchData();
    } catch (e) { 
      // 🌟 AHORA MUESTRA EL ERROR REAL DEL BACKEND
      errorAlert('Error', e.response?.data?.message || 'No se pudo actualizar el usuario.'); 
    }
  };

  // 3. BORRAR USUARIO
  const handleDelete = async (id, name) => {
    const result = await confirmAction('¿ELIMINAR USUARIO?', `¿Estás seguro de borrar a ${name}?`, 'SÍ, BORRAR');
    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/users/${id}`);
        await successAlert('BORRADO', res.data.message || 'Usuario eliminado del sistema.');
        fetchData();
      } catch (e) { 
        // 🌟 AHORA MUESTRA EL ERROR REAL DEL BACKEND (Ej: "No puedes borrarte a ti mismo")
        errorAlert('ERROR', e.response?.data?.message || 'No se pudo eliminar.'); 
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#030303] text-white pt-28 px-4 md:px-12 pb-12"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER CON BUSCADOR Y BOTÓN VOLVER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="group p-4 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-dk-gold transition-all"
            >
              <span className="text-gray-500 group-hover:text-dk-gold">←</span>
            </button>
            <div>
              <h1 className="text-5xl font-vogue text-dk-gold tracking-tighter uppercase">
                Gestión de <span className="italic text-white">Usuarios</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-2">Control total del ecosistema D'KAIZEN</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="w-full bg-black border border-gray-800 p-4 pl-12 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-black/50">
                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Usuario</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Rol</th>
                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const isMe = currentUser?.id === user.id;

                return (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-900/50 transition-colors ${isMe ? 'bg-dk-gold/5' : 'hover:bg-white/[0.01]'}`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold border ${isMe ? 'bg-dk-gold text-black border-dk-gold' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {user.name} 
                            {isMe && <span className="text-[8px] bg-dk-gold text-black px-2 py-0.5 rounded-full font-black">TÚ</span>}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-500">{user.email}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border ${
                        user.role === 'admin' ? 'border-dk-red text-dk-red bg-dk-red/5' : 'border-gray-800 text-gray-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button 
                          disabled={isMe}
                          onClick={() => { setEditingUser(user); setFormData({ name: user.name, email: user.email, role: user.role }); }}
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isMe ? 'opacity-20 cursor-not-allowed' : 'text-dk-gold hover:scale-110'}`}
                        >
                          Editar
                        </button>
                        <button 
                          disabled={isMe}
                          onClick={() => handleDelete(user.id, user.name)}
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isMe ? 'opacity-20 cursor-not-allowed' : 'text-red-600 hover:scale-110'}`}
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 text-center text-gray-700 font-vogue tracking-[0.5em]">
              SIN COINCIDENCIAS
            </motion.div>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingUser(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0a0a0a] border border-gray-800 p-12 rounded-[3rem] w-full max-w-md shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dk-gold to-transparent opacity-30"></div>
              <h2 className="text-3xl font-vogue text-dk-gold mb-10 text-center uppercase tracking-widest">Ajustar Perfil</h2>
              
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-600 ml-1 font-bold">Nombre Completo</label>
                  <input type="text" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-600 ml-1 font-bold">Correo Electrónico</label>
                  <input type="email" className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-600 ml-1 font-bold">Rol Asignado</label>
                  <div className="relative">
                    <select className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xs outline-none focus:border-dk-gold text-white appearance-none cursor-pointer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="client">Cliente</option>
                      <option value="barber">Barbero</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dk-gold pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-gray-900/50 text-gray-500 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 bg-dk-gold text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-dk-gold/10 hover:bg-white transition-all">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Users;