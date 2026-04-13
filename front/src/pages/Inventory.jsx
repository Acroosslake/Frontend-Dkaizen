import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { successAlert, errorAlert, confirmAction } from '../utils/alerts';

function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Cuidado Capilar' });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (e) {
      console.error("Error en el almacén:", e);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      successAlert('¡INVENTARIO SINCRONIZADO!', 'El producto ha sido registrado correctamente.');
      setShowModal(false);
      fetchProducts();
    } catch (e) { errorAlert('Error', 'No se pudo actualizar el stock.'); }
  };

  const handleDelete = async (id) => {
    const res = await confirmAction('¿Retirar Producto?', 'Esto eliminará el registro del inventario.', 'Eliminar');
    if (res.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (e) { errorAlert('Error', 'Fallo al eliminar el producto.'); }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative pt-24 px-4 md:px-12 pb-12 overflow-hidden">
      
      {/* GLOW DE FONDO */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-dk-red/5 blur-[150px] rounded-full -ml-48 -mb-48 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER CON BOTÓN VOLVER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center justify-center w-12 h-12 rounded-full border border-gray-800 bg-black/50 hover:border-dk-gold transition-all duration-500 shadow-lg"
            >
              <span className="text-dk-gold group-hover:-translate-x-1 transition-transform text-xl">←</span>
            </button>
            <div>
              <p className="text-dk-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-1">Logística de Almacén</p>
              <h1 className="text-5xl md:text-6xl font-light">
                Control de <span className="font-vogue text-white italic">Suministros</span>
              </h1>
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingProduct(null); setFormData({name:'', price:'', stock:'', category: 'Cuidado Capilar'}); setShowModal(true); }}
            className="bg-white text-black px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-dk-gold transition-all"
          >
            + Ingresar Nuevo Producto
          </motion.button>
        </div>

        {/* CONTENEDOR DE TABLA PREMIUM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-black/40">
                  <th className="p-8 text-[10px] uppercase text-gray-500 font-black tracking-widest">Insumo</th>
                  <th className="p-8 text-[10px] uppercase text-gray-500 font-black tracking-widest">Categoría</th>
                  <th className="p-8 text-[10px] uppercase text-gray-500 font-black tracking-widest text-center">Stock Actual</th>
                  <th className="p-8 text-[10px] uppercase text-gray-500 font-black tracking-widest">Precio Venta</th>
                  <th className="p-8 text-[10px] uppercase text-gray-500 font-black tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-dk-gold"></div>
                        <span className="font-bold text-gray-200 text-lg">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-[10px] bg-gray-900 text-gray-400 px-3 py-1 rounded-full uppercase font-bold border border-gray-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-vogue ${p.stock <= 5 ? 'text-dk-red' : 'text-white'}`}>
                          {p.stock}
                        </span>
                        <div className="w-16 h-1 bg-gray-900 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full ${p.stock <= 5 ? 'bg-dk-red' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(p.stock * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 font-bold text-dk-gold text-lg">
                      ${Number(p.price).toLocaleString()}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }}
                          className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-dk-gold hover:bg-dk-gold/10 transition-all"
                        >
                          ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-dk-red hover:bg-dk-red/10 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && !loading && (
              <div className="p-20 text-center">
                <p className="text-gray-600 uppercase tracking-widest text-xs">No hay suministros registrados en el almacén</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* MODAL DK-LOGISTICS */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-[#0a0a0a] border border-gray-800 p-8 md:p-12 rounded-[3rem] w-full max-w-lg shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-white/10"></div>

              <h2 className="text-3xl font-vogue text-white mb-10 text-center uppercase tracking-[0.2em]">
                {editingProduct ? 'Editar' : 'Nuevo'} <span className="text-dk-gold italic">Insumo</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block tracking-widest">Nombre del Producto</label>
                  <input 
                    type="text" required
                    className="w-full bg-black border border-gray-900 p-4 rounded-2xl text-sm outline-none focus:border-dk-gold transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block tracking-widest">Categoría</label>
                  <select 
                    className="w-full bg-black border border-gray-900 p-4 rounded-2xl text-sm outline-none focus:border-dk-gold transition-all text-white appearance-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Cuidado Capilar">Cuidado Capilar</option>
                    <option value="Barba">Barba</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Herramientas">Herramientas</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block tracking-widest">Precio Venta</label>
                    <input 
                      type="number" required
                      className="w-full bg-black border border-gray-900 p-4 rounded-2xl text-sm outline-none focus:border-dk-gold transition-all"
                      value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black ml-4 mb-2 block tracking-widest">Stock Inicial</label>
                    <input 
                      type="number" required
                      className="w-full bg-black border border-gray-900 p-4 rounded-2xl text-sm outline-none focus:border-dk-gold transition-all"
                      value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest mt-6 hover:bg-dk-gold transition-all shadow-xl"
                >
                  {editingProduct ? 'Actualizar Almacén' : 'Confirmar Ingreso'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Inventory;