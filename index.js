//Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

//Configuração APP
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON
app.use(morgan("dev"));

//Configuração do Banco de dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); //efetivar a conexão

//Definição de rotas

const rotaProfessores = require ("./routes/professores")

app.use(rotaProfessores);


//Escuta dos eventos(listen)
app.listen(3000, () => {
  //Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync(/* { force: true } */);
  console.log("Servidor rodando em http://localhost:3000");
});
