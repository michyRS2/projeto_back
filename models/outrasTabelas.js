const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const { DataTypes } = Sequelize;

// Categoria
//exemplo de categoria: desenvolvimento
const Categoria = sequelize.define("categoria", {
  ID_Categoria: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nome: Sequelize.STRING(100)
}, {
  tableName: 'Categoria',
  timestamps: false
});

// Área
//exemplo de área pertencente a categoria desenvolvimento: Desenvolvimento mobile
const Area = sequelize.define("area", {
  ID_Area: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nome: Sequelize.STRING(100),
  ID_Categoria: Sequelize.INTEGER
}, {
  tableName: 'Area',
  timestamps: false
});

// Tópico
//exemplo de tópico pertencente a Desenvolvimento mobile: Flutter
const Topico = sequelize.define("topico", {
  ID_Topico: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nome: Sequelize.STRING(100),
  ID_Area: Sequelize.INTEGER
}, {
  tableName: 'Topico',
  timestamps: false
});

// Curso
const Curso = sequelize.define("curso", {
  ID_Curso: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  ID_Gestor:{
    type: Sequelize.INTEGER,
    allowNull: true
  },
  Nome_Curso: Sequelize.STRING(100),
  Tipo_Curso: Sequelize.STRING(20),
  Estado_Curso: Sequelize.STRING(20),
  Descricao: Sequelize.TEXT,
  Data_Inicio: Sequelize.DATE,
  Data_Fim: Sequelize.DATE,
  Vagas: Sequelize.INTEGER,
  Imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ID_Topico: Sequelize.INTEGER,
  Rating: { type: Sequelize.FLOAT, allowNull: true, defaultValue: 0 },
  Objetivos: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  },
  Includes: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  },
  CriadoPor: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  AtualizadoPor: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Curso',
  timestamps: false, // createdAt e updatedAt automáticos
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Módulo
const Modulo = sequelize.define("modulo", {
  ID_Modulo: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  ID_Curso: Sequelize.INTEGER,
  Titulo: Sequelize.STRING(100),
}, {
  tableName: 'Modulo',
  timestamps: false
});

// Aula
const Aula = sequelize.define("aula", {
  ID_Aula: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  ID_Modulo: Sequelize.INTEGER,
  Titulo: Sequelize.STRING(100),
  Descricao: Sequelize.TEXT
}, {
  tableName: 'Aula',
  timestamps: false
});

// Conteúdo Curso
const ConteudoCurso = sequelize.define("conteudo_curso", {
  ID_Conteudo: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Curso: Sequelize.INTEGER,
  Tipo_Conteudo: Sequelize.STRING(20),
  URL: Sequelize.TEXT,
  Descricao: Sequelize.TEXT
}, {
  tableName: 'ConteudoCurso',
  timestamps: false
});

// Quiz
const Quiz = sequelize.define("quiz", {
  ID_Quiz: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Curso: Sequelize.INTEGER,
  Titulo: Sequelize.STRING(100)
}, {
  tableName: 'Quiz',
  timestamps: false
});

// Pergunta
const Pergunta = sequelize.define("pergunta", {
  ID_Pergunta: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Quiz: Sequelize.INTEGER,
  Texto: Sequelize.TEXT
}, {
  tableName: 'Pergunta',
  timestamps: false
});

// Resposta
const Resposta = sequelize.define("resposta", {
  ID_Resposta: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Pergunta: Sequelize.INTEGER,
  Texto: Sequelize.TEXT,
  Correta: Sequelize.BOOLEAN
}, {
  tableName: 'Resposta',
  timestamps: false
});

// Fórum
const Forum = sequelize.define("forum", {
  ID_Forum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Titulo: Sequelize.STRING(100),
  Descricao: Sequelize.TEXT
}, {
  tableName: 'Forum',
  timestamps: false
});

// Notificação
const Notificacao = sequelize.define("notificacao", {
  ID_Notificacao: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Titulo: Sequelize.STRING(100),
  Mensagem: Sequelize.TEXT,
  Data_Envio: Sequelize.DATE
}, {
  tableName: 'Notificacao',
  timestamps: false
});

module.exports = {
  Categoria,
  Area,
  Topico,
  Curso,
  Modulo,
  Aula,
  ConteudoCurso,
  Quiz,
  Pergunta,
  Resposta,
  Forum,
  Notificacao
};
