// routes/dispositivos.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware para validar JSON
const validarDispositivo = (req, res, next) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal } = req.body;
  
  const errores = [];
  
  // Validaciones básicas
  if (!nombre || !nombre.trim()) {
    errores.push('El nombre del dispositivo es requerido');
  }
  
  if (!ubicacion || !ubicacion.trim()) {
    errores.push('La ubicación es requerida');
  }
  
  if (!coordenadas || !coordenadas.trim()) {
    errores.push('Las coordenadas son requeridas');
  }
  
  // Validar estructura JSON de métricas
  const validarMetrica = (metrica, nombre) => {
    if (!metrica || typeof metrica !== 'object') {
      errores.push(`${nombre} debe ser un objeto válido`);
      return;
    }
    
    if (!metrica.hasOwnProperty('nominal') || !metrica.hasOwnProperty('minimo') || !metrica.hasOwnProperty('maximo')) {
      errores.push(`${nombre} debe tener valores nominal, mínimo y máximo`);
      return;
    }
    
    if (isNaN(metrica.nominal) || isNaN(metrica.minimo) || isNaN(metrica.maximo)) {
      errores.push(`Los valores de ${nombre} deben ser numéricos`);
      return;
    }
    
    if (metrica.minimo >= metrica.nominal) {
      errores.push(`El valor mínimo de ${nombre} debe ser menor al nominal`);
    }
    
    if (metrica.maximo <= metrica.nominal) {
      errores.push(`El valor máximo de ${nombre} debe ser mayor al nominal`);
    }
  };
  
  validarMetrica(potencia, 'potencia');
  validarMetrica(voltaje, 'voltaje');
  validarMetrica(corriente, 'corriente');
  validarMetrica(caudal, 'caudal');
  
  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Datos de validación incorrectos',
      details: errores
    });
  }
  
  next();
};

// POST /api/dispositivos - Crear nuevo dispositivo
router.post('/', validarDispositivo, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      nombre,
      ubicacion,
      coordenadas,
      potencia,
      voltaje,
      corriente,
      caudal,
      estado = 1,
      registro_usuario = 0
    } = req.body;

    // Verificar si ya existe un dispositivo con el mismo nombre
    const checkQuery = 'SELECT id FROM sistemas.dispositivos WHERE nombre = $1';
    const checkResult = await client.query(checkQuery, [nombre.trim()]);
    
    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe un dispositivo con ese nombre',
        message: 'Por favor, use un nombre diferente'
      });
    }

    // Insertar el nuevo dispositivo
    const insertQuery = `
      INSERT INTO sistemas.dispositivos 
      (nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado, registro_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado, registro_fecha
    `;
    
    const values = [
      nombre.trim(),
      ubicacion.trim(),
      coordenadas.trim(),
      JSON.stringify(potencia),
      JSON.stringify(voltaje),
      JSON.stringify(corriente),
      JSON.stringify(caudal),
      estado,
      registro_usuario
    ];
    
    const result = await client.query(insertQuery, values);
    const nuevoDispositivo = result.rows[0];
    
    // Parsear JSON fields para la respuesta
    nuevoDispositivo.potencia = JSON.parse(nuevoDispositivo.potencia);
    nuevoDispositivo.voltaje = JSON.parse(nuevoDispositivo.voltaje);
    nuevoDispositivo.corriente = JSON.parse(nuevoDispositivo.corriente);
    nuevoDispositivo.caudal = JSON.parse(nuevoDispositivo.caudal);
    
    console.log(`✅ Nuevo dispositivo creado: ${nuevoDispositivo.nombre} (ID: ${nuevoDispositivo.id})`);
    
    res.status(201).json({
      success: true,
      message: 'Dispositivo creado exitosamente',
      data: nuevoDispositivo
    });
    
  } catch (error) {
    console.error('❌ Error al crear dispositivo:', error);
    
    // Manejar errores específicos de PostgreSQL
    if (error.code === '23505') { // unique_violation
      return res.status(409).json({
        error: 'Ya existe un dispositivo con ese nombre',
        message: 'Por favor, use un nombre diferente'
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el dispositivo'
    });
  } finally {
    client.release();
  }
});

// GET /api/dispositivos - Obtener todos los dispositivos
router.get('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const query = `
      SELECT id, nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado, registro_fecha
      FROM sistemas.dispositivos 
      ORDER BY registro_fecha DESC
    `;
    
    const result = await client.query(query);
    
    // Parsear JSON fields
    const dispositivos = result.rows.map(dispositivo => ({
      ...dispositivo,
      potencia: JSON.parse(dispositivo.potencia),
      voltaje: JSON.parse(dispositivo.voltaje),
      corriente: JSON.parse(dispositivo.corriente),
      caudal: JSON.parse(dispositivo.caudal)
    }));
    
    res.json({
      success: true,
      data: dispositivos,
      count: dispositivos.length
    });
    
  } catch (error) {
    console.error('❌ Error al obtener dispositivos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los dispositivos'
    });
  } finally {
    client.release();
  }
});

// GET /api/dispositivos/:id - Obtener un dispositivo específico
router.get('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número'
      });
    }
    
    const query = `
      SELECT id, nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado, registro_fecha
      FROM sistemas.dispositivos 
      WHERE id = $1
    `;
    
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Dispositivo no encontrado',
        message: `No existe un dispositivo con ID ${id}`
      });
    }
    
    const dispositivo = result.rows[0];
    
    // Parsear JSON fields
    dispositivo.potencia = JSON.parse(dispositivo.potencia);
    dispositivo.voltaje = JSON.parse(dispositivo.voltaje);
    dispositivo.corriente = JSON.parse(dispositivo.corriente);
    dispositivo.caudal = JSON.parse(dispositivo.caudal);
    
    res.json({
      success: true,
      data: dispositivo
    });
    
  } catch (error) {
    console.error('❌ Error al obtener dispositivo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el dispositivo'
    });
  } finally {
    client.release();
  }
});

module.exports = router;