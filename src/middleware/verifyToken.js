const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Revisamos si el token viene en el header 
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado. Se requiere token." });
    }

    try {
        // Validamos el token 
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token no válido" });
    }
};
