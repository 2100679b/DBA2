const express = require('express');
const cors = require('cors');
const app = express();

// Configuración CORS más segura
app.use(cors({
  origin: [
    'https://demodba2.netlify.app',  // Tu dominio Netlify
    'http://localhost:5173'          // Desarrollo local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE']  // <<-- ¡Asegúrate que POST esté incluido!
}));

// Middleware crucial para parsear JSON
app.use(express.json());

// Corrección en la ruta base
const dispositivosRouter = require('./routes/dispositivos');
app.use('/api', dispositivosRouter);  // <<-- ¡Cambiado a '/api'!

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API iniciada en puerto ${PORT}`);
});