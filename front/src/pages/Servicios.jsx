import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Servicios() {
  const menuServicios = [
    { 
      id: 1,
      nombre: "Corte Premium", 
      precio: "$35,000", 
      desc: "Asesoría de imagen, corte a tijera/máquina, lavado, peinado con productos premium y bebida de cortesía (whisky o cerveza).",
      imagen: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000"
    },
    { 
      id: 2,
      nombre: "Ritual de Barba", 
      precio: "$25,000", 
      desc: "Perfilado exacto, toalla caliente con vaporzon, aromaterapia, afeitado a navaja clásica y bálsamo hidratante para cerrar poros.",
      imagen: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1000"
    },
    { 
      id: 3,
      nombre: "Combo Master VIP", 
      precio: "$55,000", 
      desc: "La experiencia D'Kaizen definitiva. Renovación total de cabello y barba con tratamiento de hidratación profunda y masaje craneal.",
      imagen: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
    },
    { 
      id: 4,
      nombre: "Camuflaje de Canas", 
      precio: "$40,000", 
      desc: "Tinte semi-permanente sutil aplicado con brocha especial para rejuvenecer tu apariencia manteniendo un look 100% natural.",
      imagen: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=1000"
    },
    { 
      id: 5,
      nombre: "Limpieza Facial VIP", 
      precio: "$30,000", 
      desc: "Exfoliación profunda, mascarilla de carbón activado, extracción de puntos negros y masaje facial con rodillo de jade.",
      imagen: "https://images.unsplash.com/photo-1512496015851-a1cbf4c568d2?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  // Estado para saber qué servicio está seleccionado actualmente
  const [activo, setActivo] = useState(menuServicios[0]);

  return (
    <div className="min-h-screen bg-dk-dark text-white font-sans relative flex flex-col">
      
      {/* NAVBAR PÚBLICO */}
      <header className="pt-6 w-full flex justify-center relative z-50">
        <nav className="bg-dk-red/90 backdrop-blur-sm rounded-full w-[90%] max-w-5xl px-8 py-3 flex justify-between items-center shadow-2xl">
          <Link to="/" className="text-white font-vogue text-2xl tracking-widest">D'Kaizen</Link>
          <ul className="hidden md:flex space-x-8 text-sm font-light text-white/90">
            <Link to="/" className="hover:text-dk-gold transition">Inicio</Link>
            <Link to="/nosotros" className="hover:text-dk-gold transition">Nosotros</Link>
            <Link to="/servicios" className="text-dk-gold font-bold transition">Servicios</Link>
            <Link to="/reservas" className="hover:text-dk-gold transition">Reservas</Link>
          </ul>
          <Link to="/login" className="flex items-center space-x-2 bg-black/40 px-4 py-1.5 rounded-full hover:bg-black/60 transition">
            <span className="text-sm">Iniciar Sesión</span>
          </Link>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL: SPLIT SCREEN (Pantalla Dividida) */}
      <main className="flex-1 max-w-7xl mx-auto w-full mt-12 px-4 pb-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LADO IZQUIERDO: Lista de Servicios */}
        <div className="w-full lg:w-5/12 pt-8">
          <p className="text-dk-red uppercase tracking-[0.3em] text-xs font-bold mb-4">Nuestro Menú</p>
          <h1 className="text-5xl font-light mb-10">Servicios de <span className="font-vogue text-dk-gold italic">Excelencia</span></h1>
          
          <div className="space-y-2">
            {menuServicios.map((servicio) => (
              <div 
                key={servicio.id}
                onClick={() => setActivo(servicio)}
                className={`cursor-pointer px-6 py-5 rounded-2xl transition-all duration-300 border-l-4 ${
                  activo.id === servicio.id 
                  ? 'bg-[#1a1a1a] border-dk-gold shadow-lg' 
                  : 'border-transparent hover:bg-[#111111] hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-vogue ${activo.id === servicio.id ? 'text-dk-gold' : 'text-gray-300'}`}>
                    {servicio.nombre}
                  </h3>
                  <span className={`font-bold ${activo.id === servicio.id ? 'text-white' : 'text-gray-500'}`}>
                    {servicio.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LADO DERECHO: Tarjeta de Exhibición (Sticky/Fija) */}
        <div className="w-full lg:w-7/12 sticky top-32">
          <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 relative group">
            
            {/* Imagen Dinámica */}
            <div className="h-80 md:h-[450px] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-10"></div>
              {/* Le ponemos un key a la imagen para que React fuerce una animación sutil al cambiarla */}
              <img 
                key={activo.id}
                src={activo.imagen} 
                alt={activo.nombre} 
                className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-in-out]"
              />
            </div>

            {/* Información Dinámica */}
            <div className="p-8 relative z-20 -mt-20">
              <div className="bg-dk-dark/90 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-3xl font-vogue text-white">{activo.nombre}</h2>
                  <span className="text-2xl font-bold text-dk-gold">{activo.precio}</span>
                </div>
                <p className="text-gray-400 font-light leading-relaxed mb-8">
                  {activo.desc}
                </p>
                
                <Link to="/reservas" className="inline-block w-full">
                  <button className="w-full bg-dk-red hover:bg-red-800 text-white font-bold py-4 rounded-xl tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(189,0,3,0.3)]">
                    AGENDAR ESTE SERVICIO
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Pequeña inyección de CSS para la animación de la foto */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}

export default Servicios;