import Swal from 'sweetalert2';

// Esta es la base con los colores de D'KAIZEN
const DKaizenSwal = Swal.mixin({
  background: '#111111',
  color: '#ffffff',
  confirmButtonColor: '#d4af37', // Oro
  cancelButtonColor: '#333333',
  reverseButtons: true,
  customClass: {
    popup: 'border border-gray-800 rounded-2xl shadow-2xl',
    confirmButton: 'rounded-full px-8 py-2 font-bold uppercase tracking-widest text-[10px]',
    cancelButton: 'rounded-full px-8 py-2 font-bold uppercase tracking-widest text-[10px]'
  }
});

// Función para alertas de éxito (Contratos, Citas agendadas)
export const successAlert = (title, text) => {
  DKaizenSwal.fire({
    icon: 'success',
    iconColor: '#d4af37',
    title: `<span style="font-family: 'Vogue', serif; letter-spacing: 2px;">${title}</span>`,
    text: text,
    timer: 3000,
    showConfirmButton: false,
  });
};

// Función para errores
export const errorAlert = (title, text) => {
  DKaizenSwal.fire({
    icon: 'error',
    iconColor: '#bd0003', // Rojo
    title: title,
    text: text,
    confirmButtonText: 'ENTENDIDO'
  });
};

// Función para confirmaciones (Eliminar, Completar cita)
export const confirmAction = async (title, text, confirmText = 'SÍ, CONFIRMAR') => {
  return DKaizenSwal.fire({
    title: title,
    text: text,
    icon: 'question',
    iconColor: '#d4af37',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'CANCELAR',
  });
};