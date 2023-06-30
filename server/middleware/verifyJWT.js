const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Não autorizado || Token inválido" });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    try {
        jwt.verify(token, secret);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Não autorizado || Token inválido" });
    }
};

module.exports = verifyJWT;