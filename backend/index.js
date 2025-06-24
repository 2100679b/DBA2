require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rutas
const usersRoutes = require('./routes/users');
const dispositivosRoutes = require('./routes/dispositivos');

// Asociar rutas principales
app.use('/api/users', usersRoutes);
app.use('/api/dispositivos', dispositivosRoutes);

// Ruta de prueba para saber si el backend está activo
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🚀 Backend activo y funcionando',
    version: '1.0.0',
    entorno: process.env.NODE_ENV || 'development'
  });
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('\x1b[31m', '⚠️ Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Exportar la instancia de Express para que pueda usarse en daemon.js
module.exports = app;
