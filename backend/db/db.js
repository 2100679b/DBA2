require('dotenv').config();
const { Pool } = require('pg');

// Validación crítica de variables de entorno
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
  process.exit(1);  // Salir si faltan variables críticas
}

// Configuración mejorada de SSL
const getSSLConfig = () => {
  if (process.env.DB_SSL === 'false') return false;
  
  return {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    ca: process.env.DB_SSL_CA || null
  };
};

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432,  // Conversión explícita a número
  ssl: getSSLConfig(),
  connectionTimeoutMillis: 5000,  // Timeout de conexión
  idleTimeoutMillis: 30000,       // Conexiones inactivas
  max: 20                         // Máximo de conexiones
});

// Verificación de conexión al iniciar
(async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Conectado a PostgreSQL en: ${process.env.DB_HOST}`);
    client.release();
    
    // Test de conexión básica
    const res = await pool.query('SELECT NOW() as current_time');
    console.log(`🕒 Hora de la base de datos: ${res.rows[0].current_time}`);
  } catch (err) {
    console.error(`❌ Error al conectar a PostgreSQL (${process.env.DB_HOST}):`, err.message);
    console.error('Detalles:', {
      user: process.env.DB_USER,
      db: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT) || 5432
    });
    process.exit(1);  // Salir si no se puede conectar
  }
})();

// Manejo de eventos mejorado
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
  // No salir aquí - el pool intentará reconectar
});

pool.on('connect', (client) => {
  // Opcional: Configuración por conexión
  client.query('SET search_path TO sistemas;');
});

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
      .then(res => {
        const duration = Date.now() - start;
        console.log(`📤 Query ejecutada en ${duration}ms: ${text}`);
        return res;
      })
      .catch(err => {
        console.error(`❌ Error en query: ${text}`, err.message);
        throw err;
      });
  },
  
  // Método para cerrar el pool correctamente
  close: () => pool.end()
};