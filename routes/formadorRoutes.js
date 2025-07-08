const express = require("express");
const router = express.Router();
const formadorController = require("../controllers/formadorController");
const moduloController = require('../controllers/moduloController');
const verifyRole = require('../middlewares/verifyRole');

router.use(verifyRole('formador'));

router.get("/dashboard", formadorController.getDashboard);

router.get("/editar-curso/:id", formadorController.getCursoParaEdicao);
router.put("/editar-curso/:cursoId/list", formadorController.atualizarCursoDoFormador);




module.exports = router;
