const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Turma = require("./turma");

const Professor = connection.define("professor", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
});

// Adiciona validação personalizada para verificar se o email já existe antes de criar um novo registro
Professor.beforeCreate(async (professor, options) => {
  const emailExists = await Professor.findOne({ where: { email: professor.email } });
  if (emailExists) {
    throw new Error("Este email já está cadastrado");
  }
});

Professor.hasOne(Turma);
Turma.belongsTo(Professor);

module.exports = Professor;