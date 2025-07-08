const {
  Curso,
  Formador,
  Topico,
  Area,
  Categoria,
  Modulo,
  Aula,
} = require("../models");

exports.getDashboard = async (req, res) => {
  try {
    const ID_Formador = req.user.id;

    const cursos = await Curso.findAll({
      where: { ID_Formador },
      include: [
        {
          model: Topico,
          as: "topico",
          include: {
            model: Area,
            as: "area",
            include: {
              model: Categoria,
              as: "categoria",
            },
          },
        },
      ],
    });

    const cursosDoFormador = cursos.map((curso) => {
      const categoria = curso?.topico?.area?.categoria;

      return {
        ID_Curso: curso.ID_Curso,
        Nome_Curso: curso.Nome_Curso,
        Tipo_Curso: curso.Tipo_Curso,
        Estado_Curso: curso.Estado_Curso,
        Data_Inicio: curso.Data_Inicio,
        Data_Fim: curso.Data_Fim,
        Imagem: curso.Imagem,
        Categoria: categoria ? categoria.Nome : null,
      };
    });

    res.json({
      cursosDoFormador,
    });
  } catch (err) {
    console.error("Erro ao obter dashboard do formador:", err);
    res.status(500).json({ error: "Erro ao carregar dashboard do formador" });
  }
};

exports.getCursoParaEdicao = async (req, res) => {
  const { id } = req.params;
  const ID_Formador = req.user.id;

  try {
    const curso = await Curso.findOne({
      where: { ID_Curso: id, ID_Formador },
      attributes: ["ID_Curso", "Nome_Curso", "Objetivos", "Includes"],
      include: [
        {
          model: Modulo,
          as: "modulos",
          include: {
            model: Aula,
            as: "aulas",
          },
        },
      ],
    });

    if (!curso) {
      return res
        .status(404)
        .json({ error: "Curso não encontrado ou não autorizado." });
    }

    res.json(curso);
  } catch (err) {
    console.error("Erro ao carregar curso para edição:", err);
    res.status(500).json({ error: "Erro ao carregar curso" });
  }
};

exports.atualizarCursoDoFormador = async (req, res) => {
  const { cursoId } = req.params;
  const ID_Formador = req.user.id;
  const { Objetivos, Includes, Modulos } = req.body;

  try {
    // Validar se o curso pertence ao formador
    const curso = await Curso.findOne({
      where: { ID_Curso: cursoId, ID_Formador },
    });
    if (!curso) {
      return res
        .status(404)
        .json({ error: "Curso não encontrado ou não autorizado." });
    }

    const objetivosLimpos = Array.isArray(Objetivos) ? Objetivos : [];
    const includesLimpos = Array.isArray(Includes) ? Includes : [];

    await curso.update({
      Objetivos: objetivosLimpos,
      Includes: includesLimpos,
    });

    // Apagar módulos e aulas antigos
    const modulosAntigos = await Modulo.findAll({
      where: { ID_Curso: cursoId },
      include: { model: Aula, as: "aulas" },
    });

    for (const mod of modulosAntigos) {
      await Aula.destroy({ where: { ID_Modulo: mod.ID_Modulo } });
      await mod.destroy();
    }

    // Criar novos módulos e aulas
    for (const modulo of Modulos || []) {
      const novoModulo = await Modulo.create({
        ID_Curso: cursoId,
        Titulo: modulo.Titulo,
      });

      for (const aula of modulo.Aulas || []) {
        await Aula.create({
          ID_Modulo: novoModulo.ID_Modulo,
          Titulo: aula.Titulo,
          Descricao: aula.Descricao || null,
        });
      }
    }

    return res.status(200).json({ mensagem: "Curso atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar curso do formador:", err);
    return res.status(500).json({ error: "Erro ao atualizar o curso." });
  }
};
