/**
 * Calcula la edad basada en la fecha de nacimiento
 * @param {string} fechaNacimiento - Fecha en formato 'YYYY-MM-DD'
 * @returns {number} - Edad en años
 */
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
};

/**
 * Formatea una fecha para mostrar
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @returns {string} - Fecha formateada 'DD/MM/YYYY'
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR');
};

/**
 * Valida que una fecha no sea futura
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @returns {boolean} - true si la fecha es válida
 */
export const validarFechaNacimiento = (fecha) => {
  if (!fecha) return false;
  
  const fechaNacimiento = new Date(fecha);
  const hoy = new Date();
  
  return fechaNacimiento < hoy;
};