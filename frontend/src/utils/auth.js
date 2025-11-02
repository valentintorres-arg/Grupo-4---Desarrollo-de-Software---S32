// Utilidades para manejo de autenticación

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si hay un token válido en localStorage
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return token !== null;
};

/**
 * Cierra la sesión del usuario eliminando todos los tokens
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_matricula');
};

/**
 * Obtiene los headers de autorización para las peticiones HTTP
 * @returns {object} Headers con el token de autorización
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Obtiene los datos del usuario almacenados
 * @returns {object} Datos del usuario
 */
export const getUserData = () => {
  return {
    matricula: localStorage.getItem('user_matricula'),
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  };
};

/**
 * Verifica si el token está expirado (básico)
 * @returns {boolean} true si el token está expirado
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return true;
  
  try {
    // Decodificar el payload del JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return true;
  }
};