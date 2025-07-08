const express = require('express');
const router = express.Router({mergeParams: true});

const {criarModulosEAulas, atualizarModulosEAulas} = require('../controllers/moduloController');
const { listarModulosEAulas } = require('../controllers/moduloController');

router.post('/', criarModulosEAulas);
router.put('/:cursoId/list', atualizarModulosEAulas);
router.get('/:cursoId/list', listarModulosEAulas);

module.exports = router;