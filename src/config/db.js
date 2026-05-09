// Conexion con la base de datos
const mysql = require('mysql2');
require('dotenv').config(); 

// Los datos estan en .env para que no se suban a github
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
});

module.exports = pool.promise();

console.log(' Configuración de DB cargada correctamente');
