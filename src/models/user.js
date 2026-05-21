//FUNCION PARA LAS PETICIONES SQL AL SMBD
const db = require('../config/db'); 

const Models = {
    // Buscar Admin para el Login
    findUserByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM empleados WHERE username = ?', [username]);
        return rows[0]; 
    },
    // Creamos las funciones para el CRUD de empleados
    getAllEmployees: async () => {
        const [rows] = await db.execute('SELECT * FROM empleados');
        return rows;
    },
    getEmployeeByName: async (username) => {
        const [rows] = await db.execute('SELECT * FROM empleados WHERE username LIKE ?', [`%${username}%`]);
        return rows;
    },
    createEmployee: async (data) => {
        const { username, password, phone, lastname, email, address, rol } = data;
        return await db.execute('INSERT INTO empleados ( username, password, phone, lastname, email, address, rol) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, password, phone, lastname, email, address, rol]);
    },
    updateEmployee: async (id, data) => {
        const { username, password, phone, lastname, email, address, rol } = data;
        return await db.execute('UPDATE empleados SET username = ?, password = ?, phone = ?, lastname = ?, email = ?, address = ?, rol = ? WHERE idEmployee = ?', [username, password, phone, lastname, email, address, rol, id]);
    },
    deleteEmployee: async (id) => {
        return await db.execute('DELETE FROM empleados WHERE idEmployee = ?', [id]);
    }
};

module.exports = Models;
