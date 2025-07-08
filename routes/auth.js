const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');





// Rotas existentes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/auth/check', authController.checkAuth);

router.post('/logout', authController.logout);

// Solicitar recuperação de senha
router.post('/auth/request-password-reset', authController.requestPasswordReset);

// Redefinir senha (via token)
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;