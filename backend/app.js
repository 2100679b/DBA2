const express = require('express');
const app = express();

const dispositivosRoutes = require('./routes/dispositivos'); // Ejemplo

app.use(express.json());

// Esta línea define que tus rutas empiezan en /api/dispositivos
app.use('/api/dispositivos', dispositivosRoutes);

// Endpoint para verificar que el backend está vivo
app.get('/health', (req, res) => res.send('OK'));

app.listen(3001, () => {
  console.log('🚀 Backend en puerto 3001');
});
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API simulacion funcionando' });
});
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Simulación');
});
