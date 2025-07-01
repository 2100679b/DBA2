const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware para validar datos de entrada
const validateDeviceData = (req, res, next) => {
  const { nombre, ubicacion, coordenadas } = req.body;
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Nombre es requerido y debe ser texto válido' 
    });
  }

  if (!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim().length === 0) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Ubicación es requerida y debe ser texto válido' 
    });
  }

  if (!coordenadas || typeof coordenadas !== 'object' || 
      !coordenadas.lat || !coordenadas.lng) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Coordenadas inválidas. Debe ser objeto con propiedades lat y lng' 
    });
  }

  next();
};

router.post('/agregar', validateDeviceData, async (req, res) => {
  try {
    const { 
      nombre, 
      ubicacion, 
      coordenadas, 
      potencia = {}, 
      voltaje = {}, 
      corriente = {}, 
      caudal = {}, 
      registro_usuario = 0 
    } = req.body;

    // Función para validar y sanitizar objetos de mediciones
    const sanitizeMeasurement = (obj) => {
      const validKeys = ['valor', 'unidad', 'fecha'];
      const sanitized = {};
      
      for (const key of validKeys) {
        if (obj[key] !== undefined) {
          sanitized[key] = obj[key];
        }
      }
      
      return Object.keys(sanitized).length > 0 ? sanitized : null;
    };

    const query = `
      INSERT INTO sistemas.dispositivos (
        nombre, ubicacion, coordenadas,
        potencia, voltaje, corriente, caudal,
        registro_usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nombre.trim(),
      ubicacion.trim(),
      JSON.stringify({
        lat: parseFloat(coordenadas.lat),
        lng: parseFloat(coordenadas.lng)
      }),
      sanitizeMeasurement(potencia),
      sanitizeMeasurement(voltaje),
      sanitizeMeasurement(corriente),
      sanitizeMeasurement(caudal),
      parseInt(registro_usuario) || 0
    ];

    const result = await db.query(query, values);
    
    res.status(201).json({ 
      ok: true, 
      dispositivo: result.rows[0],
      message: 'Dispositivo registrado exitosamente'
    });
    
  } catch (err) {
    console.error('Error al agregar dispositivo:', err.message);
    
    // Manejo específico de errores de base de datos
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;
    
    if (err.code === '23505') {  // Violación de unique constraint
      errorMessage = 'Ya existe un dispositivo con ese nombre';
      statusCode = 409;
    } else if (err.code === '22P02') {  // Error de tipo de dato
      errorMessage = 'Tipo de dato inválido en uno de los campos';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      ok: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;