// backend/controllers/moduloController.js
const { Modulo, Aula } = require("../models");

async function criarModulosEAulas(req, res) {
  const { cursoId } = req.params;
  const { Modulos } = req.body;

  try {
    if (!Array.isArray(Modulos)) {
      return res.status(400).json({ error: 'Envie um array "Modulos"' });
    }

    for (const modulo of Modulos) {
      // evita criar módulos vazios
      if (!modulo.Titulo?.trim()) continue;

      const novoModulo = await Modulo.create({
        ID_Curso: cursoId,
        Titulo: modulo.Titulo.trim(),
      });

      // cria cada aula
      if (Array.isArray(modulo.Aulas)) {
        for (const aula of modulo.Aulas) {
          if (!aula.Titulo?.trim()) continue;
          await Aula.create({
            ID_Modulo: novoModulo.ID_Modulo,
            Titulo: aula.Titulo.trim(),
            Descricao: aula.Descricao?.trim() || null,
          });
        }
      }
    }

    return res
      .status(201)
      .json({ message: "Módulos e aulas criados com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar módulos e aulas:", err);
    return res
      .status(500)
      .json({ error: "Erro interno ao criar módulos e aulas." });
  }
}

const atualizarModulosEAulas = async (req, res) => {
  const cursoId = req.params.cursoId;
  const modulos = req.body;

  try {
    const modulosAntigos = await Modulo.findAll({
      where: { ID_Curso: cursoId },
      include: {
        model: Aula,
        as: "aulas",
      },
    });

    for (const mod of modulosAntigos) {
      await Aula.destroy({ where: { ID_Modulo: mod.ID_Modulo } });
      await mod.destroy();
    }

    for (const modulo of modulos) {
      const novoModulo = await Modulo.create({
        ID_Curso: cursoId,
        Titulo: modulo.Titulo,
      });

      if (Array.isArray(modulo.Aulas)) {
        for (const aula of modulo.Aulas) {
          await Aula.create({
            ID_Modulo: novoModulo.ID_Modulo,
            Titulo: aula.Titulo,
            Descricao: aula.Descricao || null,
          });
        }
      }
    }

    res
      .status(200)
      .json({ mensagem: "Módulos e aulas atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar módulos e aulas:", error);
    res.status(500).json({ erro: "Erro ao atualizar módulos e aulas." });
  }
};

// Listar todos os módulos e aulas de um curso
const listarModulosEAulas = async (req, res) => {
  const { cursoId } = req.params;

  try {
    const modulos = await Modulo.findAll({
      where: { ID_Curso: cursoId },
      include: [
        {
          model: Aula,
          as: "aulas", // garante que está em conformidade com a associação
        },
      ],
      order: [
        ["ID_Modulo", "ASC"],
        [{ model: Aula, as: "aulas" }, "ID_Aula", "ASC"],
      ],
    });

    res.json(modulos);
  } catch (err) {
    console.error("Erro ao listar módulos e aulas:", err);
    res.status(500).json({ erro: "Erro ao listar módulos e aulas." });
  }
};

module.exports = {
  criarModulosEAulas,
  atualizarModulosEAulas,
  listarModulosEAulas,
};
