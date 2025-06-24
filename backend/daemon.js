// daemon.js (versión mejorada)
require('dotenv').config();
console.log('🔹 Iniciando daemon.js - PID:', process.pid);

// 1. Cargar variables críticas primero
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
console.log('🔹 Configuración:');
console.log(`- PORT: ${PORT}`);
console.log(`- HOST: ${HOST}`);
console.log(`- DB_HOST: ${process.env.DB_HOST || 'No configurado'}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// 2. Cargar la aplicación
let app;
try {
  app = require('./index');
  
  // Verificación profunda de Express
  if (!app || typeof app.listen !== 'function') {
    console.error('❌ Error: index.js no exporta una instancia válida de Express');
    console.log('🔍 Detalles:', {
      type: typeof app,
      methods: app ? Object.keys(app) : 'null'
    });
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error fatal al importar la aplicación:', error.stack || error.message);
  process.exit(1);
}

// 3. Iniciar servidor
console.log('🔹 Iniciando servidor Express...');
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor backend activo en https://${HOST}:${PORT}`);
  console.log(`📅 Inicio: ${new Date().toLocaleString()}`);
  console.log(`🌎 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 PID: ${process.pid}`);
});

// 4. Configurar manejadores de eventos
server.on('error', (error) => {
  console.error('❌ Error del servidor:', error.code || error.message);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`💡 El puerto ${PORT} está ocupado. Soluciones:`);
    console.error(`1. Cambia el puerto: export PORT=${Number(PORT)+1}`);
    console.error(`2. Libera el puerto: sudo kill -9 $(sudo lsof -t -i:${PORT})`);
  }
  
  process.exit(1);
});

// 5. Manejo de errores globales
process.on('uncaughtException', (err) => {
  console.error('\n🔥 uncaughtException:', err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n🔥 unhandledRejection:', reason);
});

// 6. Cierre controlado
const gracefulShutdown = (signal) => {
  console.log(`\n📤 Señal ${signal} recibida. Cerrando servidor...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar servidor:', err);
      return process.exit(1);
    }
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('⏰ Cierre forzado tras 10 segundos');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 7. Solo para propósitos de prueba
module.exports = server;