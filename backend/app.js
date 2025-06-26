const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dispositivosRouter = require('./routes/dispositivos');
app.use('/api/dispositivos', dispositivosRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API iniciada en puerto ${PORT}`);
});
