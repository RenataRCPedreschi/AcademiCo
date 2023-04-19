// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Professor = connection.define("professor",{
nome:{
    type:DataTypes.STRING,
    allowNull: false,
},
dataNasc:{
    type:DataTypes.DATEONLY,
    allowNull:false,
},

telefone:{
    type: DataTypes.STRING,
    allowNull:false,
},
email:{
    type:DataTypes.STRING,
    allowNull:false,
},

    
});