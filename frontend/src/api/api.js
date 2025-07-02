import axios from 'axios';

// Determinar si estamos en producción
const isProduction = import.meta.env.MODE === 'production';

// Base URL:
const baseURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL  // URL real definida en entorno
  : isProduction
    ? '/.netlify/functions'       // Si usas funciones Netlify
    : '/backend-api';             // Ruta relativa para desarrollo (proxy local)

// Crear instancia de Axios
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

// Interceptor para agregar token (si existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
