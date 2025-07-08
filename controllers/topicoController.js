const { Topico } = require("../models");

exports.getTopicos = async (req, res) => {
  try {
    const topicos = await Topico.findAll();
    res.json(topicos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter tópicos" });
  }
};
