// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");


const Aluno = connection.define("aluno",{
    nome:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O nome é obrigatório."
            },
            len: {
                args: [2, 255],
                msg: "O nome deve ter entre 2 e 255 caracteres."
            }
        }
    },
    dataNasc:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        validate: {
            notEmpty: {
                msg: "A data de nascimento é obrigatória."
            },
            isDate: {
                msg: "A data de nascimento deve estar no formato yyyy-mm-dd."
            }
        }
    },
    telefone:{
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: {
                msg: "O telefone é obrigatório."
            },
            len: {
                args: [1, 18],
                msg: "O telefone deve ter entre 1 e 18 caracteres."
            }
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: {
                msg: "O e-mail é obrigatório."
            },
            isEmail: {
                msg: "O e-mail informado não é válido."
            }
        }
    },
    numMatr:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notEmpty: {
                msg: "O número de matrícula é obrigatório."
            },
            len: {
                args: [1, 12],
                msg: "O número de matrícula deve ter entre 1 e 12 caracteres."
            }
        }
    }
});


module.exports = Aluno; 








