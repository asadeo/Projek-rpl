// middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token diperlukan' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia');
        req.user = decoded; // decoded harus memuat `id`
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
}

module.exports = authMiddleware;
