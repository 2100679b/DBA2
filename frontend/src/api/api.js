import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // Esto toma el valor de http://18.119.167.171:3000 desde tu .env
  timeout: 10000, // Tiempo máximo de espera en milisegundos
});

export default api;