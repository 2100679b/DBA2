// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================
// Middlewares de seguridad
// ==============================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      'https://demodba2.netlify.app'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutos
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // límite de requests
  message: {
    error: 'Demasiadas solicitudes',
    message: 'Por favor, intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ==============================
// Middlewares de parsing
// ==============================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================
// Logging de requests
// ==============================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'unknown'}`);
  next();
});

// ==============================
// Rutas de la API
// ==============================

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Rutas principales
const dispositivosRoutes = require('./routes/dispositivos');
app.use('/api/dispositivos', dispositivosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Simulación de Dispositivos',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/health',
      dispositivos: '/api/dispositivos'
    }
  });
});

// ==============================
// Manejo de errores
// ==============================

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /api/dispositivos',
      'POST /api/dispositivos',
      'GET /api/dispositivos/:id'
    ]
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  
  // Error de CORS
  if (error.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Origen no permitido por CORS'
    });
  }
  
  // Error de JSON parsing
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'El cuerpo de la solicitud contiene JSON malformado'
    });
  }
  
  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// ==============================
// Iniciar servidor
// ==============================
const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor iniciado exitosamente
📍 Puerto: ${PORT}
🌍 Entorno: ${process.env.NODE_ENV}
🔗 URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
🔌 API Dispositivos: http://localhost:${PORT}/api/dispositivos
  `);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

module.exports = app;