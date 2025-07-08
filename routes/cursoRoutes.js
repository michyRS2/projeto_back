const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", cursoController.criarCurso);

router.get('/search', authMiddleware, cursoController.searchCursos);

router.get('/:id', cursoController.getCursoDetalhado);

module.exports = router;
