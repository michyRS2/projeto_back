const express = require("express");
const router = express.Router();
const topicoController = require("../controllers/topicoController");

router.get("/", topicoController.getTopicos);

module.exports = router;
