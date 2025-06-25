const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/agregar', async (req, res) => {
  try {
    const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, registro_usuario } = req.body;

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
      nombre,
      ubicacion,
      coordenadas,
      JSON.stringify(potencia),
      JSON.stringify(voltaje),
      JSON.stringify(corriente),
      JSON.stringify(caudal),
      registro_usuario || 0
    ];

    const result = await db.query(query, values);
    res.status(201).json({ ok: true, dispositivo: result.rows[0] });
  } catch (err) {
    console.error('Error al agregar dispositivo:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
