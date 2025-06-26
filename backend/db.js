// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'adminuno',
  host: 'a2100679b.c3y80kgqitws.us-east-2.rds.amazonaws.com',  // IP pública o endpoint RDS
  database: 'simulacion',
  password: 'pwod.2025',
  port: 5432,
  ssl: true, // Cambia a true si usas SSL
});

module.exports = pool;
