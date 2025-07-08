const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

router.get("/", categoriaController.getCategorias);
router.get("/:id", categoriaController.getCategoriaById);
router.get("/:id/areas", categoriaController.getAreasByCategoria);

module.exports = router;
