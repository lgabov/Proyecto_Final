//Aqui van las funciones de las rutas
const Models = require('../models/user');
const jwt = require('jsonwebtoken');

// AUTENTICACIÓN 
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Models.findUserByUsername(username);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ msg: "Usuario o contraseña incorrectos" });
        }

        const payload = { 
            id: user.idEmployee, 
            username: user.username, 
            rol: user.rol || 'user' 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'clave', { expiresIn: '8h' });
        
        return res.json({ token, msg: "Login exitoso" });

    } catch (error) {
        console.error("ERROR REAL:", error);
        if (!res.headersSent) {
            return res.status(500).json({ msg: "Error en el servidor" });
        }
    }
};



//  ACCIONES DE EMPLEADOS (CRUD) 
exports.getEmployees = async (req, res) => {
    try {
        const { name } = req.query; 
        const data = name ? await Models.getEmployeeByName(name) : await Models.getAllEmployees();
        res.json(data);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener empleados" });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        await Models.createEmployee(req.body);
        res.status(201).json({ msg: "Empleado agregado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al crear empleado" });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        await Models.updateEmployee(req.params.id, req.body);
        res.json({ msg: "Empleado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar" });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Models.deleteEmployee(req.params.id);
        res.json({ msg: "Empleado eliminado de la base de datos" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar" });
    }
};
