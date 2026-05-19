const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Revisamos si el token viene en el header 
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Acceso denegado. Se requiere token." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Validamos el token 
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token no válido" });
    }
};

