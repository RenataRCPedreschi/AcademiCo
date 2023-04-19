// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Turma = connection.define("turma",{
codTurma:{
    type:DataTypes.STRING,
    allowNull: false,
},
    
});

const Aluno = require("./aluno");

Turma.hasMany(Aluno);
Aluno.belongsTo(Turma);

module.exports = Turma;