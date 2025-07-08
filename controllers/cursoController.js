const {
  Curso,
  Formador,
  Topico,
  Area,
  Categoria,
  Modulo,
  Aula,
  Inscricao,
  Sequelize,
} = require("../models");
const { Op } = require("sequelize");

// Função para sanitizar a query de busca (remove caracteres especiais)
const sanitizeQuery = (str) => {
  return str.replace(/[^\w\sÀ-ÿ]/gi, ""); // Mantém letras, números e espaços
};

//Criar Curso
const criarCurso = async (req, res) => {
  try {
    const {
      Nome_Curso, Tipo_Curso, Descricao, Data_Inicio, Data_Fim, Imagem, ID_Topico,
      Vagas, ID_Formador, Objetivos, Includes
    } = req.body;

    const novoCurso = await Curso.create({
      Nome_Curso,
      Tipo_Curso,
      Descricao,
      Data_Inicio,
      Data_Fim,
      Imagem,
      ID_Topico,
      Vagas: Vagas || null,
      ID_Formador: ID_Formador || null,
      Objetivos: Objetivos ? JSON.stringify(Objetivos) : null,
      Includes: Includes ? JSON.stringify(Includes) : null,
    });

    return res.status(201).json({ ID_Curso: novoCurso.ID_Curso });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar curso." });
  }
};

// Buscar detalhes completos de um curso pelo ID
const getCursoDetalhado = async (req, res) => {
  const { id } = req.params;

  try {
const curso = await Curso.findByPk(parseInt(id), {
  include: [
    {
      model: Topico,
      as: "topico",
      include: [
        {
          model: Area,
          as: "area",
          include: [
            {
              model: Categoria,
              as: "categoria",
              attributes: ["Nome"],
            },
          ],
        },
      ],
    },
    {
      model: Formador,
      as: "formador",
      attributes: ["Nome"],
    },
    {
      model: Modulo,
      include: [
        {
          model: Aula,
          as: 'aulas'
        }
      ]
    }
  ],
});


    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado" });
    }

    // Monta resposta simplificada
    const categoriaNome = curso.topico?.area?.categoria?.Nome || "N/A";
    const formadorNome = curso.formador?.Nome || "N/A";

    const cursoDetalhado = {
      ID_Curso: curso.ID_Curso,
      Nome_Curso: curso.Nome_Curso,
      Imagem: curso.Imagem,
      Tipo_Curso: curso.Tipo_Curso,
      Categoria: categoriaNome,
      Formador: formadorNome,
      ID_Topico: curso.ID_Topico,
      Data_Inicio: curso.Data_Inicio,
      Data_Fim: curso.Data_Fim,
      Descricao: curso.Descricao,
      Vagas: curso.Vagas,
      Rating: curso.Rating,
      Objetivos: curso.Objetivos,
      Includes: curso.Includes,
      modulos: curso.modulos,
      CriadoPor: curso.CriadoPor,
      AtualizadoPor: curso.AtualizadoPor,
    };

    res.json(cursoDetalhado);
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    res.status(500).json({ erro: "Erro interno ao buscar curso" });
  }
};

// Buscar cursos pela query de pesquisa
const searchCursos = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ erro: "O termo de pesquisa é obrigatório" });
  }

  const sanitizedQuery = sanitizeQuery(query);
  const ID_Formando = req.user?.id;

  try {
    // Buscar cursos com os seus dados
    const cursos = await Curso.findAll({
      limit: 5,
      subQuery: false,
      include: [
        {
          model: Topico,
          as: "topico",
          include: [
            {
              model: Area,
              as: "area",
              include: [
                {
                  model: Categoria,
                  as: "categoria",
                },
              ],
            },
          ],
        },
        {
          model: Formador,
          as: "formador",
          attributes: ["Nome"],
        },
      ],
      where: {
        [Op.or]: [
          { Nome_Curso: { [Op.iLike]: `%${sanitizedQuery}%` } },
          { "$topico.Nome$": { [Op.iLike]: `%${sanitizedQuery}%` } },
          { "$topico.area.Nome$": { [Op.iLike]: `%${sanitizedQuery}%` } },
          { "$topico.area.categoria.Nome$": { [Op.iLike]: `%${sanitizedQuery}%` } },
        ],
      },
    });

    // Obter os IDs dos cursos encontrados
    const cursoIds = cursos.map((c) => c.ID_Curso);

    // Buscar as inscrições do formando nesses cursos
    const inscricoes = await Inscricao.findAll({
      where: {
        ID_Formando,
        ID_Curso: cursoIds,
      },
    });

    const cursosInscritos = inscricoes.map((i) => i.ID_Curso);

    // Construir resposta
    const resultados = cursos.map((curso) => {
      const categoria = curso.topico?.area?.categoria?.Nome || "N/A";
      const formador = curso.formador?.[0]?.Nome || "N/A";
      const dataInicio = curso.Data_Inicio;
      const dataFim = curso.Data_Fim;

      return {
        id: curso.ID_Curso,
        title: curso.Nome_Curso,
        category: categoria,
        formador: formador,
        startDate: dataInicio,
        endDate: dataFim,
        period:
          dataInicio && dataFim
            ? Math.ceil((new Date(dataFim) - new Date(dataInicio)) / (1000 * 60 * 60 * 24))
            : 0,
        inscrito: cursosInscritos.includes(curso.ID_Curso),
      };
    });

    res.json(resultados);
  } catch (error) {
    console.error("Erro na busca de cursos:", error);
    res.status(500).json({
      erro: "Erro interno ao buscar cursos",
      detalhes: error.message,
    });
  }
};

module.exports = {
  getCursoDetalhado,
  searchCursos,
  criarCurso,
};
