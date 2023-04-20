// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require('sequelize');
const { connection } = require('./database');


const Turma = connection.define('turma', {
  codTurma: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'O código da turma é obrigatório.'
      }
    }
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O turno é obrigatório.'
      }
    }
  },
  disciplina: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A disciplina é obrigatória.'
      }
    }
  }
});


const Aluno = require('./aluno');

Turma.hasMany(Aluno);
Aluno.belongsTo(Turma);

module.exports = Turma;
