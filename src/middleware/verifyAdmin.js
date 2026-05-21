
const verifyAdmin = (req, res, next) => {
    const user = req.user; 
     console.log("👉 Datos reales que llegaron al middleware:", user);
if(!user || user.rol !== 'admin') {
        return res.status(403).json({ msg: "Acceso denegado. Se requiere rol de administrador." });

    }
    next();
};
module.exports = verifyAdmin;
