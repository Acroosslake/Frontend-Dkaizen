{/* SECCIÓN DE DATOS (Para llenar el vacío) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Actividad Reciente */}
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8">
             <h2 className="text-xl font-light mb-6 flex items-center text-gray-200">
               <span className="w-6 h-px bg-dk-red mr-4"></span> Últimos Movimientos
             </h2>
             <div className="space-y-4">
               {[
                 { id: 1, corte: "Corte Premium", cliente: "Mario Santos", barbero: "Julian V.", precio: "$35,000", hora: "Hace 10 min" },
                 { id: 2, corte: "Ritual de Barba", cliente: "David Silva", barbero: "Alex R.", precio: "$25,000", hora: "Hace 1 hora" },
                 { id: 3, corte: "Combo Master", cliente: "Andrés B.", barbero: "Julian V.", precio: "$55,000", hora: "Hace 3 horas" }
               ].map((item) => (
                 <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-900 hover:border-gray-700 transition">
                   <div>
                     <p className="text-white font-medium">{item.corte}</p>
                     <p className="text-xs text-gray-500">Cliente: {item.cliente} • {item.barbero}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-dk-gold font-bold">{item.precio}</p>
                     <p className="text-xs text-gray-600">{item.hora}</p>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-6 py-3 text-xs uppercase tracking-widest text-gray-500 hover:text-white border border-gray-900 hover:border-gray-700 rounded-lg transition">Ver Historial Completo</button>
          </div>

          {/* Gráfica Placeholder (Futura data de Laravel) */}
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-light mb-2 flex items-center text-gray-200">
                <span className="w-6 h-px bg-dk-gold mr-4"></span> Rendimiento Semanal
              </h2>
              <p className="text-gray-500 text-sm">Aquí conectaremos la gráfica de ingresos con Chart.js y Laravel.</p>
            </div>
            
            <div className="h-48 w-full border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center mt-6">
               <div className="text-center">
                 <span className="text-4xl">📈</span>
                 <p className="text-gray-600 mt-2 text-sm uppercase tracking-widest">Esperando Datos API</p>
               </div>
            </div>
          </div>
        </motion.div>