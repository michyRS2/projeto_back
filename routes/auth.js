const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');



const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1]; 
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};



// Rotas existentes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/auth/check', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Autenticado', user: req.user });
});
router.post('/logout', authController.logout);

// Solicitar recuperação de senha
router.post('/auth/request-password-reset', authController.requestPasswordReset);

// Redefinir senha (via token)
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;