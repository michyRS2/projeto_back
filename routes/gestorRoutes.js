const express = require("express");
const router = express.Router();
const gestorController = require("../controllers/gestorController");
const verifyRole = require('../middlewares/verifyRole');
const moduloRoutes = require('./moduloRoutes');

router.use(verifyRole('gestor')); // protege todas as rotas abaixo



// Dashboard
router.get("/dashboard", gestorController.getDashboardStats);

// Cursos
router.get("/cursos", gestorController.getCursos);
router.get("/cursos/:id", gestorController.getCursoById);
router.post("/cursos", gestorController.createCurso);
router.put("/cursos/:id", gestorController.updateCurso);
router.delete("/cursos/:id",gestorController.deleteCurso);

router.use('/cursos/:cursoId/modulos', moduloRoutes);

// Categorias
router.get("/categorias", gestorController.getCategorias);
router.post("/categorias", gestorController.createCategoria);
router.put("/categorias/:id", gestorController.updateCategoria);
router.delete("/categorias/:id", gestorController.deleteCategoria);

// Areas
router.get("/areas", gestorController.getAreas);
router.post("/areas", gestorController.createArea);
router.put("/areas/:id", gestorController.updateArea);
router.delete("/areas/:id", gestorController.deleteArea);

// Topicos
router.get("/topicos", gestorController.getTopicos);
router.post("/topicos", gestorController.createTopico);
router.put("/topicos/:id", gestorController.updateTopico);
router.delete("/topicos/:id", gestorController.deleteTopico);


// Percurso formativo dos formandos
router.get("/percursos", gestorController.getPercursoFormativo);

router.get("/formadores", gestorController.getFormadores);


module.exports = router;
