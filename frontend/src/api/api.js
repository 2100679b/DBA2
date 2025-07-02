import axios from 'axios';

// Definir la URL base usando variables de entorno o un valor por defecto
const baseURL = import.meta.env.VITE_API_URL || 'http://18.119.167.171:3001/api';

// Crear la instancia de axios con la configuración inicial
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de espera
});

// Interceptor para manejar errores de manera centralizada
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Función para agregar o eliminar el token de autenticación
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;