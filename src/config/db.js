// Conexion con la base de datod
pool.query = util.promisify(pool.query);
module.exports = pool

const mysql = require('mysql2');
require('dotenv').config(); 

// Los datos estan en .env para que no se suban a github y no sean visibles para todo el mundo
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
