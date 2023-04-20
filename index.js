//Importações principais e variáveis de ambiente
require("dotenv").config();
const morgan = require("morgan");
const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

//Configuração APP
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON
app.use(morgan("dev"));


//Configuração do Banco de dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); //efetivar a conexão

//Definição de rotas

const rotaProfessores = require("./routes/professores");
const rotaAlunos = require("./routes/alunos");
const rotaTurmas = require("./routes/turmas");

app.use(rotaProfessores);
app.use(rotaAlunos);
app.use(rotaTurmas);


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AcademiCo - Gestão Escolar",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "AcademiCo",
        url: "https://academico.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs,{ explorer: true })
);



//Escuta dos eventos(listen)
app.listen(3000, () => {
  //Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync(/* { force: true } */);
  console.log("Servidor rodando em http://localhost:3000");
});
