//Aqui van las rutas (toma las funciones del controller)

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller'); 
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin'); 
const Models = require('../models/user');

//Ruta para el login
router.post('/login', controller.login);

router.post('/employees', verifyToken, verifyAdmin, controller.createEmployee);
router.put('/employees/:id', verifyToken, verifyAdmin, controller.updateEmployee);
router.delete('/employees/:id', verifyToken, verifyAdmin, controller.deleteEmployee);

router.get('/employees/search', verifyToken, verifyAdmin, controller.getEmployees);

// Rutas para el CRUD de empleados
//Obtener empleados (con opción de búsqueda por nombre)
router.get('/employees', controller.getEmployees);

// Agregar un nuevo empleado
router.post('/employees', verifyToken,verifyAdmin, controller.createEmployee);

// Modificar datos de un empleado existente
router.put('/employees/:id', verifyToken,verifyAdmin, controller.updateEmployee);

// Eliminar un empleado de la base de datos
router.delete('/employees/:id', verifyToken,verifyAdmin, controller.deleteEmployee);


module.exports = router;
