const jwt = require('jsonwebtoken');

// autenticacion de token
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(401).json({ ok: false, err: 'Token invalido' });

        req.usuario = decoded.usuario;

        // res.json({ token });
        next();
    });
};

// autenticacion de privilegios de administrador
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') return res.status(401).json({ ok: false, err: 'Rol invalido' });
    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
}