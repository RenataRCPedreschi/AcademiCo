const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Turma = require("./turma");

const Professor = connection.define("professor", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Por favor, insira o nome do professor."
      },
      len: {
        args: [2, 100],
        msg: "O nome do professor deve ter entre 2 e 100 caracteres."
      }
    }
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Por favor, insira a data de nascimento do professor."
      },
      isDate: {
        msg: "Por favor, insira uma data de nascimento válida."
      }
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Por favor, insira o telefone do professor."
      },
      len: {
        args: [1, 18],
        msg: "O telefone do professor deve ter entre 1 e 18 caracteres."
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Por favor, insira o e-mail do professor."
      },
      isEmail: {
        msg: "Por favor, insira um e-mail válido."
      }
    }
  }
});

// Adiciona validação personalizada para verificar se o email já existe antes de criar um novo registro
Professor.beforeCreate(async (professor, options) => {
  const emailExists = await Professor.findOne({ where: { email: professor.email } });
  if (emailExists) {
    throw new Error("Este email já está cadastrado");
  }
});

Turma.hasOne(Professor);
Professor.belongsTo(Turma);

module.exports = Professor;
