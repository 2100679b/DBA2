require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: '*', // Puedes cambiar esto por Netlify: https://tuapp.netlify.app
  methods: ['GET', 'POST'],
  credentials: true
}));

// Rutas
const dispositivosRoutes = require('./routes/dispositivos');
app.use('/api/dispositivos', dispositivosRoutes);

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
