const { Op } = require("sequelize");
const {
  Curso,
  Formador,
  Categoria,
  Area,
  Topico,
  Gestor,
  GestorCurso,
  Formando,
  Inscricao,
  Modulo,
  Aula,
} = require("../models");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUtilizadores = await Formando.count();

    const novosUtilizadores = await Formando.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Utilizadores ativos (com pelo menos uma inscrição)
    const utilizadoresAtivos = await Inscricao.count({
      distinct: true,
      col: "ID_Formando",
    });

    // Agrupar cursos por categoria
    const categorias = await Categoria.findAll({
      include: {
        model: Area,
        as: "areas",
        include: {
          model: Topico,
          as: "topicos",
          include: {
            model: Curso,
            as: "cursos",
          },
        },
      },
    });

    const cursosPorCategoria = categorias.map((categoria) => {
      let totalCursos = 0;
      categoria.areas.forEach((area) =>
        area.topicos.forEach((topico) => (totalCursos += topico.cursos.length))
      );
      return {
        categoria: categoria.Nome,
        total: totalCursos,
      };
    });

    res.json({
      totalUtilizadores,
      novosUtilizadores,
      utilizadoresAtivos,
      cursosPorCategoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
};

//Categorias

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar categorias" });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const novaCategoria = await Categoria.create(req.body);
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.update(req.body, { where: { ID_Categoria: id } });
    res.status(200).json({ message: "Categoria atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.destroy({ where: { ID_Categoria: id } });
    res.status(200).json({ message: "Categoria eliminada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar categoria" });
  }
};

//Area
exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll({ include: Categoria });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar áreas" });
  }
};

exports.createArea = async (req, res) => {
  try {
    const novaArea = await Area.create(req.body);
    res.status(201).json(novaArea);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar área" });
  }
};

exports.updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    await Area.update(req.body, { where: { ID_Area: id } });
    res.status(200).json({ message: "Área atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar área" });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    await Area.destroy({ where: { ID_Area: id } });
    res.status(200).json({ message: "Área eliminada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar área" });
  }
};

// Topicos

exports.getTopicos = async (req, res) => {
  try {
    const topicos = await Topico.findAll({ include: Area });
    res.json(topicos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar tópicos" });
  }
};

exports.createTopico = async (req, res) => {
  try {
    const novoTopico = await Topico.create(req.body);
    res.status(201).json(novoTopico);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tópico" });
  }
};

exports.updateTopico = async (req, res) => {
  try {
    const { id } = req.params;
    await Topico.update(req.body, { where: { ID_Topico: id } });
    res.status(200).json({ message: "Tópico atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tópico" });
  }
};

exports.deleteTopico = async (req, res) => {
  try {
    const { id } = req.params;
    await Topico.destroy({ where: { ID_Topico: id } });
    res.status(200).json({ message: "Tópico eliminado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar tópico" });
  }
};

// Listar cursos
exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [
        { model: Formador, as: "formador" },
        { model: Topico, as: "topico" },
      ],
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter cursos" });
  }
};

exports.getCursoById = async (req, res) => {
  // Validação do ID
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const curso = await Curso.findByPk(id, {
      include: [
        {
          model: Modulo,
          as: "modulos",
          include: [{ model: Aula, as: "aulas" }],
        },
        { model: Formador, as: "formador" },
        { model: Topico, as: "topico" },
      ],
    });

    if (!curso) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    res.json(curso);
  } catch (error) {
    console.error("Erro ao obter curso:", error);
    res.status(500).json({
      error: "Erro ao obter curso",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Criar curso
exports.createCurso = async (req, res) => {
  try {
    const {
      Nome_Curso,
      Tipo_Curso,
      Descricao,
      Data_Inicio,
      Data_Fim,
      Vagas,
      Imagem,
      Objetivos,
      Includes,
      ID_Topico,
      ID_Formador, // opcional
    } = req.body;

    // Validação base
    if (
      !Nome_Curso ||
      !Tipo_Curso ||
      !Descricao ||
      !Data_Inicio ||
      !Data_Fim ||
      !ID_Topico
    ) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    // Validar tipo de curso
    if (Tipo_Curso === "síncrono" && (!Vagas || !ID_Formador)) {
      return res
        .status(400)
        .json({
          error: "Cursos síncronos requerem formador e número de vagas.",
        });
    }

    // Cálculo do estado automático
    const hoje = new Date();
    const inicio = new Date(Data_Inicio);
    const fim = new Date(Data_Fim);

    let estadoCalculado = "ativo";
    if (hoje >= inicio && hoje <= fim) {
      estadoCalculado = "em curso";
    } else if (hoje > fim) {
      estadoCalculado = "terminado";
    }

    const novoCurso = await Curso.create({
      Nome_Curso,
      Tipo_Curso,
      Estado_Curso: estadoCalculado,
      Descricao,
      Data_Inicio,
      Data_Fim,
      Vagas: Tipo_Curso === "síncrono" ? Vagas : null,
      Imagem,
      Objetivos: Objetivos || [],
      Includes: Includes || [],
      ID_Topico,
      ID_Formador: Tipo_Curso === "síncrono" ? ID_Formador : null,
      ID_Gestor: req.user.id, // Vem do middleware de autenticação
    });

    res.status(201).json(novoCurso);
  } catch (error) {
    console.error("Erro ao criar curso:", error.message, error.stack);
    res.status(500).json({ error: "Erro ao criar curso" });
  }
};

// Atualizar curso
exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ error: "Curso não encontrado." });
    }

    const {
      Nome_Curso,
      Tipo_Curso,
      Descricao,
      Data_Inicio,
      Data_Fim,
      Vagas,
      Imagem,
      Objetivos,
      Includes,
      ID_Topico,
      ID_Formador,
    } = req.body;

    if (!Nome_Curso || !Tipo_Curso || !Data_Inicio || !Data_Fim || !ID_Topico) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    // Validar campos extra obrigatórios para síncrono
    if (Tipo_Curso === "síncrono" && (!Vagas || !ID_Formador)) {
      return res
        .status(400)
        .json({ error: "Cursos síncronos requerem vagas e formador." });
    }

    // Estado_Curso calculado automaticamente
    const hoje = new Date();
    const inicio = new Date(Data_Inicio);
    const fim = new Date(Data_Fim);

    let estadoCalculado = "ativo";
    if (hoje >= inicio && hoje <= fim) {
      estadoCalculado = "em curso";
    } else if (hoje > fim) {
      estadoCalculado = "terminado";
    }

    const dadosAtualizados = {
      Nome_Curso,
      Tipo_Curso,
      Estado_Curso: estadoCalculado,
      Descricao,
      Data_Inicio,
      Data_Fim,
      Imagem: Imagem || null,
      ID_Topico,
      Vagas: Tipo_Curso === "síncrono" ? parseInt(Vagas) : null,
      ID_Formador: Tipo_Curso === "síncrono" ? parseInt(ID_Formador) : null,
    };

    // Adicionar apenas se for assíncrono
    if (Tipo_Curso === "assíncrono") {
      dadosAtualizados.Objetivos = Objetivos || [];
      dadosAtualizados.Includes = Includes || [];
    }

    await Curso.update(dadosAtualizados, { where: { ID_Curso: id } });

    res.status(200).json({ message: "Curso atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    res.status(500).json({ error: "Erro interno ao atualizar curso." });
  }
};

// Eliminar curso
exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    await Curso.destroy({ where: { ID_Curso: id } });
    res.status(200).json({ message: "Curso eliminado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar curso" });
  }
};

// Percurso formativo
exports.getPercursoFormativo = async (req, res) => {
  try {
    const percurso = await Formando.findAll({
      include: {
        model: Inscricao,
        include: Curso,
      },
    });
    res.json(percurso);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter percurso formativo" });
  }
};

exports.getFormadores = async (req, res) => {
  try {
    const formadores = await Formador.findAll({
      attributes: ["ID_Formador", "Nome", "Email"],
    });
    res.json(formadores);
  } catch (error) {
    console.error("Erro ao obter formadores:", error);
    res.status(500).json({ error: "Erro ao obter formadores" });
  }
};
