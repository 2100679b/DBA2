const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    'https://demodba2.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Verificar conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Rutas de la API

// GET - Obtener todos los dispositivos
app.get('/api/dispositivos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        nombre,
        ubicacion,
        coordenadas,
        potencia,
        voltaje,
        corriente,
        caudal,
        estado,
        registro_fecha
      FROM sistemas.dispositivos 
      ORDER BY registro_fecha DESC
    `);
    
    // Formatear los datos para el frontend
    const dispositivos = rows.map(row => ({
      identifica: {
        identificador: row.id,
        nombre: row.nombre,
        ubicacion: row.ubicacion,
        coordenadas: row.coordenadas,
        idestatus: 1,
        estatus: 'Operacion Normal',
        potencia: row.potencia || { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
        voltaje: row.voltaje || { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
        corriente: row.corriente || { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
        caudal: row.caudal || { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        fechaRegistro: row.registro_fecha
      },
      opera: {
        potencia: { valor: generateRandomValue(row.potencia?.nominal || 7.400, 0.5), idEstatus: 1 },
        voltaje: { valor: generateRandomValue(row.voltaje?.nominal || 240, 5), idEstatus: 1 },
        corriente: { valor: generateRandomValue(row.corriente?.nominal || 30, 2), idEstatus: 1 },
        caudal: { valor: generateRandomValue(row.caudal?.nominal || 1, 0.1), idEstatus: 1 },
        idEstatus: 1,
        estatus: 'Operacion Normal',
        fechaRegistro: new Date().toISOString()
      },
      estado: row.estado
    }));
    
    res.json(dispositivos);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener un dispositivo por ID
app.get('/api/dispositivos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM sistemas.dispositivos WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    const row = rows[0];
    const dispositivo = {
      identifica: {
        identificador: row.id,
        nombre: row.nombre,
        ubicacion: row.ubicacion,
        coordenadas: row.coordenadas,
        idestatus: 1,
        estatus: 'Operacion Normal',
        potencia: row.potencia || { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
        voltaje: row.voltaje || { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
        corriente: row.corriente || { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
        caudal: row.caudal || { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        fechaRegistro: row.registro_fecha
      },
      opera: {
        potencia: { valor: generateRandomValue(row.potencia?.nominal || 7.400, 0.5), idEstatus: 1 },
        voltaje: { valor: generateRandomValue(row.voltaje?.nominal || 240, 5), idEstatus: 1 },
        corriente: { valor: generateRandomValue(row.corriente?.nominal || 30, 2), idEstatus: 1 },
        caudal: { valor: generateRandomValue(row.caudal?.nominal || 1, 0.1), idEstatus: 1 },
        idEstatus: 1,
        estatus: 'Operacion Normal',
        fechaRegistro: new Date().toISOString()
      },
      estado: row.estado
    };
    
    res.json(dispositivo);
  } catch (error) {
    console.error('Error al obtener dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear un nuevo dispositivo - CORREGIDO PARA ACEPTAR AMBOS FORMATOS
app.post('/api/dispositivos', async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    
    let datosDispositivo;
    
    // Verificar si los datos vienen en formato directo (como en tu error)
    if (req.body.nombre && req.body.ubicacion) {
      datosDispositivo = {
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion,
        coordenadas: req.body.coordenadas,
        potencia: req.body.potencia,
        voltaje: req.body.voltaje,
        corriente: req.body.corriente,
        caudal: req.body.caudal
      };
    } 
    // O si vienen en formato con estructura 'identifica'
    else if (req.body.identifica) {
      const { identifica } = req.body;
      datosDispositivo = {
        nombre: identifica.nombre,
        ubicacion: identifica.ubicacion,
        coordenadas: identifica.coordenadas,
        potencia: identifica.potencia,
        voltaje: identifica.voltaje,
        corriente: identifica.corriente,
        caudal: identifica.caudal
      };
    } else {
      return res.status(400).json({ error: 'Formato de datos incorrecto' });
    }
    
    if (!datosDispositivo.nombre || !datosDispositivo.ubicacion) {
      return res.status(400).json({ error: 'Nombre y ubicación son requeridos' });
    }
    
    // Procesar coordenadas
    let coordenadasFormateadas;
    if (datosDispositivo.coordenadas && typeof datosDispositivo.coordenadas === 'object') {
      coordenadasFormateadas = `${datosDispositivo.coordenadas.lat}° N, ${datosDispositivo.coordenadas.lng}° W`;
    } else {
      coordenadasFormateadas = datosDispositivo.coordenadas || '19.7060° N, 101.1950° W';
    }
    
    // Procesar valores de sensores
    const procesarValor = (valor, defecto) => {
      if (valor && typeof valor === 'object') {
        if (valor.valor !== undefined) {
          // Formato: {valor: 100, unidad: 'W', fecha: '...'}
          return {
            nominal: parseFloat(valor.valor),
            minimo: parseFloat(valor.valor) * 0.8,
            maximo: parseFloat(valor.valor) * 1.2,
            um: valor.unidad || defecto.um
          };
        } else {
          // Ya está en formato correcto
          return valor;
        }
      }
      return defecto;
    };
    
    const potenciaFinal = procesarValor(datosDispositivo.potencia, { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' });
    const voltajeFinal = procesarValor(datosDispositivo.voltaje, { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' });
    const corrienteFinal = procesarValor(datosDispositivo.corriente, { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' });
    const caudalFinal = procesarValor(datosDispositivo.caudal, { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' });
    
    const { rows } = await pool.query(`
      INSERT INTO sistemas.dispositivos 
      (nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        datosDispositivo.nombre,
        datosDispositivo.ubicacion,
        coordenadasFormateadas,
        JSON.stringify(potenciaFinal),
        JSON.stringify(voltajeFinal),
        JSON.stringify(corrienteFinal),
        JSON.stringify(caudalFinal),
        1
      ]
    );
    
    const newDevice = rows[0];
    const dispositivo = {
      identifica: {
        identificador: newDevice.id,
        nombre: newDevice.nombre,
        ubicacion: newDevice.ubicacion,
        coordenadas: newDevice.coordenadas,
        idestatus: 1,
        estatus: 'Operacion Normal',
        potencia: typeof newDevice.potencia === 'string' ? JSON.parse(newDevice.potencia) : newDevice.potencia,
        voltaje: typeof newDevice.voltaje === 'string' ? JSON.parse(newDevice.voltaje) : newDevice.voltaje,
        corriente: typeof newDevice.corriente === 'string' ? JSON.parse(newDevice.corriente) : newDevice.corriente,
        caudal: typeof newDevice.caudal === 'string' ? JSON.parse(newDevice.caudal) : newDevice.caudal,
        fechaRegistro: newDevice.registro_fecha
      },
      opera: {
        potencia: { valor: potenciaFinal.nominal, idEstatus: 1 },
        voltaje: { valor: voltajeFinal.nominal, idEstatus: 1 },
        corriente: { valor: corrienteFinal.nominal, idEstatus: 1 },
        caudal: { valor: caudalFinal.nominal, idEstatus: 1 },
        idEstatus: 1,
        estatus: 'Operacion Normal',
        fechaRegistro: new Date().toISOString()
      },
      estado: newDevice.estado
    };
    
    console.log('Dispositivo creado exitosamente:', dispositivo);
    res.status(201).json(dispositivo);
  } catch (error) {
    console.error('Error al guardar dispositivo:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Ya existe un dispositivo con ese nombre' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }
});

// PUT - Actualizar un dispositivo
app.put('/api/dispositivos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { identifica } = req.body;
    
    const { rows } = await pool.query(`
      UPDATE sistemas.dispositivos 
      SET nombre = $1, ubicacion = $2, coordenadas = $3, potencia = $4, voltaje = $5, corriente = $6, caudal = $7
      WHERE id = $8 
      RETURNING *`,
      [
        identifica.nombre,
        identifica.ubicacion,
        identifica.coordenadas,
        JSON.stringify(identifica.potencia),
        JSON.stringify(identifica.voltaje),
        JSON.stringify(identifica.corriente),
        JSON.stringify(identifica.caudal),
        id
      ]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE - Eliminar un dispositivo
app.delete('/api/dispositivos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM sistemas.dispositivos WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    res.json({ message: 'Dispositivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función auxiliar para generar valores aleatorios
function generateRandomValue(nominal, deviation) {
  const min = nominal - deviation;
  const max = nominal + deviation;
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
  console.log(`Servidor corriendo en http://18.119.167.171:${port}`);
});