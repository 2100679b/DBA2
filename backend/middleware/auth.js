const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añade la información del usuario al request
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = auth;