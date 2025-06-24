// db/db.js
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Configuración mejorada para SSL
const sslConfig = process.env.DB_SSL === 'true' || isProduction 
  ? { 
      rejectUnauthorized: true, // Verificar certificado en producción
      ca: process.env.DB_SSL_CA // Para certificados personalizados
    } 
  : false;

// Configuración del pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432, // Convertir a número
  ssl: sslConfig,
  max: 20, // Máximo de clientes en el pool
  idleTimeoutMillis: 30000, // 30s de inactividad antes de cerrar
  connectionTimeoutMillis: 2000, // 2s máximo para conectar
});

// Manejo de eventos
pool.on('connect', () => {
  if (isProduction) {
    console.log(`✅ Conectado a PostgreSQL (${process.env.DB_HOST})`);
  } else {
    console.log(`✅ Conectado a PostgreSQL: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  }
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
  if (isProduction) {
    // En producción podrías notificar a un sistema de monitoreo
  }
});

// Exportar con métodos adicionales para transacciones
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    return client;
  },
  // Método para transacciones
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};