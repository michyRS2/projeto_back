var Sequelize = require("sequelize");
var sequelize = require("../config/database");

const Formando = sequelize.define(
  "formando",
  {
    ID_Formando: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nome: Sequelize.STRING(100),
    Email: {
      type: Sequelize.STRING(100),
      unique: true,
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: Sequelize.BIGINT,
        allowNull: true,
    },
    Data_Nascimento: Sequelize.DATE,
  },
  {
    tableName: "Formando",
    timestamps: true,
  }
);

const Inscricao = sequelize.define(
  "inscricao",
  {
    ID_Inscricao: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Formando: Sequelize.INTEGER,
    ID_Curso: Sequelize.INTEGER,
    Data_Inscricao: Sequelize.DATE,
    Estado_Inscricao: Sequelize.STRING(20),
    Progresso:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "Inscricao",
    timestamps: false,
  }
);

const SubmissaoTrabalho = sequelize.define(
  "submissao_trabalho",
  {
    ID_Submissao: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Formando: Sequelize.INTEGER,
    ID_Curso: Sequelize.INTEGER,
    Descricao: Sequelize.TEXT,
    URL_Entrega: Sequelize.TEXT,
    Data_Submissao: Sequelize.DATE,
  },
  {
    tableName: "SubmissaoTrabalho",
    timestamps: false,
  }
);

const AvaliacaoFormando = sequelize.define(
  "avaliacao_formando",
  {
    ID_Avaliacao: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Formando: Sequelize.INTEGER,
    ID_Curso: Sequelize.INTEGER,
    Nota: Sequelize.DECIMAL(5, 2),
    Certificado: Sequelize.BOOLEAN,
    Horas_Totais: Sequelize.INTEGER,
    Horas_Presenca: Sequelize.INTEGER,
  },
  {
    tableName: "AvaliacaoFormando",
    timestamps: false,
  }
);

const RespostaFormando = sequelize.define(
  "resposta_formando",
  {
    ID_Formando: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Resposta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "RespostaFormando",
    timestamps: false,
  }
);

const NotificacaoFormando = sequelize.define(
  "notificacao_formando",
  {
    ID_Notificacao: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Formando: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    Lida: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "NotificacaoFormando",
    timestamps: false,
  }
);

module.exports = {
  Formando,
  Inscricao,
  SubmissaoTrabalho,
  AvaliacaoFormando,
  RespostaFormando,
  NotificacaoFormando,
};
