const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // 1. Verificar si el email o username ya existen
    const existCheck = await db.query(
      `SELECT * FROM seguridad.usuarios 
       WHERE email = $1 OR username = $2`,
      [email, username]
    );
    
    if (existCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'El correo o nombre de usuario ya están registrados' 
      });
    }

    // 2. Encriptar contraseña
    const hashed = await bcrypt.hash(password, 10);
    
    // 3. Insertar en base de datos (CORREGIDO: usar email en lugar de nombre)
    const result = await db.query(`
      INSERT INTO seguridad.usuarios (email, username, password, roles)
      VALUES ($1, $2, $3, ARRAY[1])  -- Asigna rol de usuario por defecto (id=1)
      RETURNING id, email, username, roles
    `, [email, username, hashed]);

    // 4. Crear token JWT
    const newUser = result.rows[0];
    const token = jwt.sign(
      { 
        id: newUser.id, 
        roles: newUser.roles 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        roles: newUser.roles
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // 1. Determinar si el identificador es email o username
    const field = identifier.includes('@') ? 'email' : 'username';
    
    // 2. Buscar usuario (CORREGIDO: usar campo 'email' en lugar de 'nombre')
    const result = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE ${field} = $1`,
      [identifier]
    );

    const user = result.rows[0];
    
    // 3. Validar existencia de usuario
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4. Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // 5. Generar token JWT con información de roles
    const token = jwt.sign(
      { 
        id: user.id, 
        roles: user.roles 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // 6. Enviar respuesta (CORREGIDO: usar email en lugar de nombre)
    res.json({ 
      message: 'Login exitoso', 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        roles: user.roles
      } 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

module.exports = router;