const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth');

// Ruta simple de prueba sin auth ni validaciones
router.post('/dispositivos', (req, res) => {
  console.log('✅ Solicitud POST recibida en /dispositivos');
  console.log('📦 Datos recibidos:', req.body);
  res.status(201).json({ message: 'Dispositivo creado (ruta básica)' });
});

// Función para validar formato de coordenadas
const validarCoordenadas = (coordenadas) => {
  if (!coordenadas) return false;
  const regex = /^\d{1,2}\.\d{4}°\s[NS],\s\d{1,3}\.\d{4}°\s[EW]$/;
  return regex.test(coordenadas);
};

// Función para convertir objetos a JSON de forma segura
const toJsonSafe = (obj) => {
  if (!obj || typeof obj !== 'object') return null;
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return null;
  }
};

// Función para validar estructura de datos de medición
const validarDatosMedicion = (datos, tipo) => {
  if (!datos) return true;
  if (typeof datos !== 'object' || Array.isArray(datos)) return false;
  const camposRequeridos = {
    potencia: ['valor', 'unidad'],
    voltaje: ['valor', 'unidad'],
    corriente: ['valor', 'unidad'],
    caudal: ['valor', 'unidad']
  };
  const campos = camposRequeridos[tipo];
  if (!campos) return false;
  return campos.every(campo =>
    datos.hasOwnProperty(campo) &&
    datos[campo] !== null &&
    datos[campo] !== undefined
  );
};

// Crear nuevo dispositivo
router.post('/', auth, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal } = req.body;
  const userId = req.user.id;

  try {
    // Validaciones básicas
    if (!nombre || !ubicacion) {
      return res.status(400).json({ 
        error: 'Nombre y ubicación son requeridos' 
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({ 
        error: 'El nombre debe tener al menos 3 caracteres' 
      });
    }

    // Validar coordenadas si se proporcionan
    const coordenadasFinal = coordenadas && validarCoordenadas(coordenadas) 
      ? coordenadas 
      : '19.7060° N, 101.1950° W'; // Coordenadas por defecto de Morelia

    // Validar datos de medición
    const tiposDatos = { potencia, voltaje, corriente, caudal };
    for (const [tipo, datos] of Object.entries(tiposDatos)) {
      if (datos && !validarDatosMedicion(datos, tipo)) {
        return res.status(400).json({
          error: `Formato inválido para ${tipo}. Debe incluir 'valor' y 'unidad'`
        });
      }
    }

    // Convertir objetos a JSON para PostgreSQL
    const potenciaJson = toJsonSafe(potencia);
    const voltajeJson = toJsonSafe(voltaje);
    const corrienteJson = toJsonSafe(corriente);
    const caudalJson = toJsonSafe(caudal);

    const result = await db.query(
      `INSERT INTO sistemas.dispositivos (
        nombre, ubicacion, coordenadas, 
        potencia, voltaje, corriente, caudal,
        registro_usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        nombre.trim(), 
        ubicacion.trim(), 
        coordenadasFinal,
        potenciaJson,
        voltajeJson,
        corrienteJson,
        caudalJson,
        userId
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Dispositivo creado exitosamente',
      dispositivo: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando dispositivo:', error);
    
    if (error.code === '23505') { // Violación de unique constraint
      return res.status(409).json({ 
        error: 'El nombre del dispositivo ya existe' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor al crear dispositivo' 
    });
  }
});

// Obtener todos los dispositivos del usuario autenticado
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, search = '' } = req.query;
  
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM sistemas.dispositivos 
      WHERE estado > 0 AND registro_usuario = $1
    `;
    let params = [userId];
    
    // Agregar búsqueda si se proporciona
    if (search.trim()) {
      query += ` AND (nombre ILIKE $${params.length + 1} OR ubicacion ILIKE $${params.length + 1})`;
      params.push(`%${search.trim()}%`);
    }
    
    query += ` ORDER BY registro_fecha DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Contar total para paginación
    const countQuery = `
      SELECT COUNT(*) FROM sistemas.dispositivos 
      WHERE estado > 0 AND registro_usuario = $1
      ${search.trim() ? 'AND (nombre ILIKE $2 OR ubicacion ILIKE $2)' : ''}
    `;
    const countParams = search.trim() ? [userId, `%${search.trim()}%`] : [userId];
    const countResult = await db.query(countQuery, countParams);
    
    res.json({
      dispositivos: result.rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        total_pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo dispositivos:', error);
    res.status(500).json({ 
      error: 'Error al obtener dispositivos' 
    });
  }
});

// Obtener dispositivo por ID
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de dispositivo inválido' 
      });
    }

    const result = await db.query(
      `SELECT * FROM sistemas.dispositivos 
       WHERE id = $1 AND estado > 0 AND registro_usuario = $2`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        error: 'Dispositivo no encontrado o no tienes permisos para acceder' 
      });
    }

    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error obteniendo dispositivo:', error);
    res.status(500).json({ 
      error: 'Error al obtener dispositivo' 
    });
  }
});

// Actualizar dispositivo
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado } = req.body;
  const userId = req.user.id;

  try {
    // Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de dispositivo inválido' 
      });
    }

    // Validaciones básicas
    if (!nombre || !ubicacion) {
      return res.status(400).json({ 
        error: 'Nombre y ubicación son requeridos' 
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({ 
        error: 'El nombre debe tener al menos 3 caracteres' 
      });
    }

    // Verificar que el dispositivo existe y pertenece al usuario
    const existeResult = await db.query(
      `SELECT id FROM sistemas.dispositivos 
       WHERE id = $1 AND estado > 0 AND registro_usuario = $2`,
      [id, userId]
    );

    if (existeResult.rowCount === 0) {
      return res.status(404).json({ 
        error: 'Dispositivo no encontrado o no tienes permisos para modificarlo' 
      });
    }

    // Validar coordenadas
    const coordenadasFinal = coordenadas && validarCoordenadas(coordenadas) 
      ? coordenadas 
      : '19.7060° N, 101.1950° W';

    // Validar datos de medición
    const tiposDatos = { potencia, voltaje, corriente, caudal };
    for (const [tipo, datos] of Object.entries(tiposDatos)) {
      if (datos && !validarDatosMedicion(datos, tipo)) {
        return res.status(400).json({
          error: `Formato inválido para ${tipo}. Debe incluir 'valor' y 'unidad'`
        });
      }
    }

    const result = await db.query(
      `UPDATE sistemas.dispositivos
       SET nombre = $1, ubicacion = $2, coordenadas = $3,
           potencia = $4, voltaje = $5, corriente = $6, caudal = $7,
           estado = $8
       WHERE id = $9 AND registro_usuario = $10
       RETURNING *`,
      [
        nombre.trim(),
        ubicacion.trim(),
        coordenadasFinal,
        toJsonSafe(potencia),
        toJsonSafe(voltaje),
        toJsonSafe(corriente),
        toJsonSafe(caudal),
        estado || 1,
        id,
        userId
      ]
    );

    res.json({
      success: true,
      message: 'Dispositivo actualizado exitosamente',
      dispositivo: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando dispositivo:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'El nombre del dispositivo ya existe' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar dispositivo' 
    });
  }
});

// Eliminar dispositivo (eliminación lógica)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de dispositivo inválido' 
      });
    }

    const result = await db.query(
      `UPDATE sistemas.dispositivos
       SET estado = 0
       WHERE id = $1 AND estado > 0 AND registro_usuario = $2
       RETURNING id, nombre, estado`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        error: 'Dispositivo no encontrado o no tienes permisos para eliminarlo' 
      });
    }

    res.json({ 
      success: true,
      message: 'Dispositivo desactivado exitosamente',
      dispositivo: result.rows[0]
    });

  } catch (error) {
    console.error('Error desactivando dispositivo:', error);
    res.status(500).json({ 
      error: 'Error al desactivar dispositivo' 
    });
  }
});

// Ruta adicional: Obtener estadísticas de dispositivos del usuario
router.get('/stats/resumen', auth, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_dispositivos,
        COUNT(CASE WHEN estado = 1 THEN 1 END) as activos,
        COUNT(CASE WHEN estado = 0 THEN 1 END) as inactivos,
        COUNT(CASE WHEN potencia IS NOT NULL THEN 1 END) as con_potencia,
        COUNT(CASE WHEN caudal IS NOT NULL THEN 1 END) as con_caudal
       FROM sistemas.dispositivos 
       WHERE registro_usuario = $1`,
      [userId]
    );
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas' 
    });
  }
});

module.exports = router;