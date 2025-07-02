import axios from 'axios';

// Base URL según entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/backend-api', // 👈 redireccionado por netlify.toml
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
  withCredentials: false, // Solo true si usas cookies de sesión
});

// Interceptor para requests - agregar token si existe
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

// Interceptor para responses - manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirige si token inválido
    }
    return Promise.reject(error);
  }
);

export default api;
