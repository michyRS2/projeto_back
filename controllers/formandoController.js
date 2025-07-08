const {
  Inscricao,
  Curso,
  Topico,
  Area,
  Categoria,
  Forum,
  Formador,
  Sequelize,
} = require("../models");

const getDashboard = async (req, res) => {
  try {
    const ID_Formando = req.user.id;

    console.log(`Buscando dados para o formando com ID: ${ID_Formando}`);

    const inscricoes = await Inscricao.findAll({
      where: { ID_Formando },
      include: {
        model: Curso,
        as: "curso",
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
          {
            model: Formador,
            as: "formador",
            attributes: ["Nome"],
          },
        ],
      },
    });

    const cursosInscritos = inscricoes.map((inscricao) => {
      const curso = inscricao.curso; // lowercase conforme alias 'curso'
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
        Formador: curso.formador?.Nome || null,
      };
    });

    // Cursos recomendados: excluir os IDs de cursos já inscritos
    const idsCursosInscritos = inscricoes
      .map((i) => i.ID_Curso)
      .filter(Boolean);

    const cursosRecomendados = await Curso.findAll({
      where: {
        ID_Curso: {
          [Sequelize.Op.notIn]: idsCursosInscritos,
        },
      },
      limit: 10,
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
        {
          model: Formador,
          as: "formador",
          attributes: ["Nome"],
        },
      ],
    });

    const recomendados = cursosRecomendados.map((curso) => {
      const categoria = curso?.topico?.area?.categoria;

      return {
        ID_Curso: curso.ID_Curso,
        Nome_Curso: curso.Nome_Curso,
        Tipo_Curso: curso.Tipo_Curso,
        Estado_Curso: curso.Estado_Curso,
        Imagem: curso.Imagem,
        Categoria: categoria ? categoria.Nome : null,
        Formador: curso.formador?.Nome || null,
      };
    });

    const percursoFormativo = inscricoes.map((inscricao) => {
      const curso = inscricao.curso;
      const categoria = curso?.topico?.area?.categoria;

      return {
        ID_Curso: curso.ID_Curso,
        Nome_Curso: curso.Nome_Curso,
        Imagem: curso.Imagem,
        Categoria: categoria ? categoria.Nome : null,
        Progresso: inscricao.Progresso || 0,
        Formador: curso.formador?.Nome || null,
      };
    });

    const topicosForum = await Forum.findAll({
      limit: 5,
    });

    const forum = topicosForum.map((topico) => ({
      ID_Forum: topico.ID_Forum,
      Titulo: topico.Titulo,
      Descricao: topico.Descricao,
    }));

    res.json({
      cursosInscritos,
      cursosRecomendados: recomendados,
      percursoFormativo,
      forum,
    });
  } catch (err) {
    console.error("Erro ao obter dashboard do formando:", err);
    res.status(500).json({ error: "Erro ao carregar dashboard do formando" });
  }
};

module.exports = {
  getDashboard,
};
