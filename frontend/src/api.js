import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://18.119.167.171:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de espera
});

export default api;
