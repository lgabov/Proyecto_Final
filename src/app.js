//Es el index del proyecto,  donde se configura el servidor y se importan las rutas
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
 
// Middlewares 
app.use(express.json()); 
app.use(require('./middleware/cors')); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
// Cargar las rutas 
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


