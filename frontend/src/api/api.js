import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://18.119.167.171:3001',
  timeout: 10000, // Tiempo máximo de espera en milisegundos
});

export default api;
