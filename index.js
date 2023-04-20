//Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const swagger = require('./swagger');


//Configuração APP
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON
app.use(morgan("dev"));
swagger(app);

//Configuração do Banco de dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); //efetivar a conexão

//Definição de rotas

const rotaProfessores = require ("./routes/professores")
const rotaAlunos = require ("./routes/alunos")
const rotaTurmas = require("./routes/turmas");

app.use(rotaProfessores);
app.use(rotaAlunos);
app.use(rotaTurmas);



//Escuta dos eventos(listen)
app.listen(3000, () => {
  //Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync(/* { force: true } */);
  console.log("Servidor rodando em http://localhost:3000");
});
