import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://18.119.167.171:3001/' : '',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;