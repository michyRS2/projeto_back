const { Categoria, Area } = require("../models");

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter categorias" });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter a categoria" });
  }
};


exports.getAreasByCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id, {
      include: {
        model: Area,
        as: "areas"
      }
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(categoria.areas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter áreas da categoria" });
  }
};
