require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

// Validación mejorada de variables de entorno
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => {
  const value = process.env[varName];
  return !value || (typeof value === 'string' && value.trim() === '');
});

if (missingVars.length > 0) {
  console.error(`❌ Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
  console.error('Valores actuales:', JSON.stringify({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'undefined',
    DB_NAME: process.env.DB_NAME
  }, null, 2));
  process.exit(1);
}

// Configuración robusta de SSL
const getSSLConfig = () => {
  if (process.env.DB_SSL === 'false') return false;
  
  const config = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  };

  // Cargar certificado CA si existe
  if (process.env.DB_SSL_CA) {
    try {
      config.ca = fs.readFileSync(process.env.DB_SSL_CA).toString();
    } catch (err) {
      console.error(`❌ Error al leer certificado SSL: ${err.message}`);
    }
  }
  
  return config;
};

// FORZAR CONTRASEÑA COMO STRING (Solución al error SASL)
const password = String(process.env.DB_PASSWORD);

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: password,  // ¡Convertido explícitamente a string!
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: getSSLConfig(),
  connectionTimeoutMillis: 10000,  // Aumentado a 10 segundos
  idleTimeoutMillis: 60000,        // 1 minuto para conexiones inactivas
  max: 15                          // Máximo de conexiones
};

// Debug: Mostrar configuración (sin contraseña)
console.log('⚙️ Configuración de PostgreSQL:', {
  ...poolConfig,
  password: '***', // Ocultar contraseña real
  ssl: poolConfig.ssl ? 'activado' : 'desactivado'
});

const pool = new Pool(poolConfig);

// Verificación de conexión mejorada
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log(`✅ Conectado a PostgreSQL en: ${process.env.DB_HOST}`);
    
    // Test de conexión y versión de PostgreSQL
    const versionRes = await client.query('SELECT version()');
    console.log(`ℹ️  Versión PostgreSQL: ${versionRes.rows[0].version.split(' ')[1]}`);
    
    // Verificar acceso al esquema
    const schemaRes = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'sistemas'
    `);
    
    if (schemaRes.rows.length === 0) {
      console.warn('⚠️  Esquema "sistemas" no encontrado. Verifica la base de datos.');
    }
    
  } catch (err) {
    console.error(`❌ Error de conexión a PostgreSQL (${process.env.DB_HOST}):`, err.message);
    console.error('Detalles del error:', {
      code: err.code,
      stack: err.stack
    });
    
    // Error específico de autenticación
    if (err.code === '28P01') {
      console.error('🔐 Error de autenticación: Verifica usuario/contraseña');
    }
    
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};

// Ejecutar prueba de conexión inmediatamente
testConnection();

// Manejo de eventos del pool
pool.on('error', (err) => {
  console.error('❌ Error en el pool de PostgreSQL:', {
    message: err.message,
    code: err.code
  });
});

pool.on('connect', (client) => {
  // Configuración inicial por conexión
  client.query('SET search_path TO sistemas;');
});

// Wrapper para queries con registro detallado
module.exports = {
  query: (text, params) => {
    const start = Date.now();
    const queryId = Math.random().toString(36).substring(2, 8); // ID único corto
    
    console.log(`🚀 Query [${queryId}]: Iniciando: ${text.substring(0, 100)}...`);
    
    return pool.query(text, params)
      .then(res => {
        const duration = Date.now() - start;
        console.log(`✅ Query [${queryId}] completada en ${duration}ms. Filas: ${res.rowCount}`);
        return res;
      })
      .catch(err => {
        const duration = Date.now() - start;
        console.error(`❌ Query [${queryId}] fallida después de ${duration}ms: ${err.message}`);
        console.error('Query:', text);
        if (params) console.error('Parámetros:', JSON.stringify(params));
        
        // Enriquecer el error con contexto adicional
        err.details = {
          query: text,
          params: params,
          duration: duration
        };
        
        throw err;
      });
  },
  
  getClient: () => pool.connect(),
  
  close: async () => {
    console.log('🛑 Cerrando pool de PostgreSQL...');
    await pool.end();
  }
};