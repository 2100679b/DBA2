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

// GET / - Obtener todos los dispositivos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        nombre,
        ubicacion,
        coordenadas,
        potencia,
        voltaje,
        corriente,
        caudal,
        registro_usuario,
        fecha_registro
      FROM sistemas.dispositivos
      ORDER BY fecha_registro DESC;
    `;
    
    const result = await db.query(query);
    
    res.json({ 
      ok: true, 
      dispositivos: result.rows,
      total: result.rows.length
    });
    
  } catch (err) {
    console.error('Error al obtener dispositivos:', err.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener dispositivos',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET /:id - Obtener dispositivo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'ID debe ser un número válido' 
      });
    }

    const query = `
      SELECT * FROM sistemas.dispositivos 
      WHERE id = $1;
    `;
    
    const result = await db.query(query, [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Dispositivo no encontrado' 
      });
    }
    
    res.json({ 
      ok: true, 
      dispositivo: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error al obtener dispositivo:', err.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener dispositivo',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST / - Crear nuevo dispositivo (cambié de /agregar a /)
router.post('/', validateDeviceData, async (req, res) => {
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
      if (!obj || typeof obj !== 'object') return null;
      
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
      sanitizeMeasurement(potencia) ? JSON.stringify(sanitizeMeasurement(potencia)) : null,
      sanitizeMeasurement(voltaje) ? JSON.stringify(sanitizeMeasurement(voltaje)) : null,
      sanitizeMeasurement(corriente) ? JSON.stringify(sanitizeMeasurement(corriente)) : null,
      sanitizeMeasurement(caudal) ? JSON.stringify(sanitizeMeasurement(caudal)) : null,
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
    } else if (err.code === '23502') {  // NOT NULL violation
      errorMessage = 'Faltan campos requeridos';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      ok: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PUT /:id - Actualizar dispositivo
router.put('/:id', validateDeviceData, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'ID debe ser un número válido' 
      });
    }

    const { 
      nombre, 
      ubicacion, 
      coordenadas, 
      potencia, 
      voltaje, 
      corriente, 
      caudal 
    } = req.body;

    const sanitizeMeasurement = (obj) => {
      if (!obj || typeof obj !== 'object') return null;
      
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
      UPDATE sistemas.dispositivos 
      SET 
        nombre = $1,
        ubicacion = $2,
        coordenadas = $3,
        potencia = $4,
        voltaje = $5,
        corriente = $6,
        caudal = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      nombre.trim(),
      ubicacion.trim(),
      JSON.stringify({
        lat: parseFloat(coordenadas.lat),
        lng: parseFloat(coordenadas.lng)
      }),
      sanitizeMeasurement(potencia) ? JSON.stringify(sanitizeMeasurement(potencia)) : null,
      sanitizeMeasurement(voltaje) ? JSON.stringify(sanitizeMeasurement(voltaje)) : null,
      sanitizeMeasurement(corriente) ? JSON.stringify(sanitizeMeasurement(corriente)) : null,
      sanitizeMeasurement(caudal) ? JSON.stringify(sanitizeMeasurement(caudal)) : null,
      parseInt(id)
    ];

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Dispositivo no encontrado' 
      });
    }
    
    res.json({ 
      ok: true, 
      dispositivo: result.rows[0],
      message: 'Dispositivo actualizado exitosamente'
    });
    
  } catch (err) {
    console.error('Error al actualizar dispositivo:', err.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al actualizar dispositivo',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE /:id - Eliminar dispositivo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'ID debe ser un número válido' 
      });
    }

    const query = `
      DELETE FROM sistemas.dispositivos 
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await db.query(query, [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Dispositivo no encontrado' 
      });
    }
    
    res.json({ 
      ok: true, 
      message: 'Dispositivo eliminado exitosamente',
      dispositivo: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error al eliminar dispositivo:', err.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Error al eliminar dispositivo',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;