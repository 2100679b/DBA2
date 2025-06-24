import axios from 'axios';

const api = axios.create({
  // Si la variable de entorno está definida, úsala, si no, usa '/api' para que Netlify haga el proxy
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000, // Tiempo máximo de espera en milisegundos
});

export default api;
