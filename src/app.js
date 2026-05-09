//Es el index del proyecto,  donde se configura el servidor y se importan las rutas
const express = require('express');
const app = express();
require('dotenv').config(); 
// Middlewares 
app.use(express.json()); // 
app.use(require('./middleware/cors')); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
// Cargar las rutas 
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); 

const PORT = process.env.PORT || PORT;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

