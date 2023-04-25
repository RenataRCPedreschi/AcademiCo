/**
 * @swagger
 * components:
 *   schemas:
 *     Alunos: 
 *       type: object
 *       required:
 *       properties:
 *         id:
 *           type: bigint
 *           description: É automaticamente gerado um ID para o aluno 
 *         nome: 
 *           type: string  
 *           allowNull: false  
 *           validate: {notEmpty: {msg: "O nome é obrigatório."}, len: {args: [2, 255], msg: "O nome deve ter entre 2 e 255 caracteres."}} 
 *           description: Nome do Aluno 
 *         dataNasc:
 *           type: dateonly
 *           allowNull: false
 *           validate: {notEmpty: {msg: "A data de nascimento é obrigatória."}, isDate: {msg: "A data de nascimento deve estar no formato yyyy-mm-dd."}}
 *           description: Nascimento do aluno
 *         telefone:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "O telefone é obrigatório"}, len: [1,18], msg: "O telefone deve ter entre 1 e 18 caracteres."}
 *           description: Telefone do aluno
 *         email:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "O e-mail é obrigatório."}, isEmail: {msg: "O e-mail informado não é válido."}}
 *           description: Email do aluno
 *         numMatr:
 *           type: string
 *           allowNull: false
 *           unique: true
 *           validate: {notEmpty: {msg: "O número de matrícula é obrigatório."}, len: [10,15], msg: "O número de matrícula deve ter entre 1 e 12 caracteres."}
 *           description: Numero de matricula do aluno
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Data que o aluno foi cadastrado na plataforma
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Ultima data que os dados do aluno foram atualizados
 *       example:  
 *         id: 1
 *         nome: Manuel
 *         dataNasc: 2000-12-25
 *         telefone: (11) 98855-9966
 *         email: manuel@gmail.com
 *         numMatr: 123456
 *         createdAt: 2023-04-20T14:23:41.438Z
 *         updatedAt: 2023-04-20T14:23:41.438Z
 *        
 */

const Aluno = require("../database/aluno");
const { Router } = require("express");
const Turma = require("../database/turma");
const { Op } = require("sequelize");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /alunos:  
 *   get:  
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       200: 
 *         description: Busca da lista alunos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       500:
 *         description: Ocorreu um erro ao buscar o aluno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */

router.get("/alunos", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr, turmaId } = req.query;
  const where = {};

  if (nome) where.nome = { [Op.like]: `%${nome}%` };
  if (dataNasc) where.dataNasc = dataNasc;
  if (telefone) where.telefone = telefone;
  if (email) where.email = email;
  if (numMatr) where.numMatr = numMatr;
  if (turmaId) where.turmaId = turmaId;

  try {
    const listaAlunos = await Aluno.findAll({ where });
    res.json(listaAlunos);
  } catch (error) {
    res.status(500).send("Erro ao buscar alunos");
  }
});


/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /alunos/turma/{id}:
 *   get:
 *     summary: Filtra os alunos por turma
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       500:
 *         description: Ocorreu um erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */



router.get("/alunos/turma/:id", async (req, res) => {
  const turmaId = req.params.id;

  // Busca a turma pelo ID e verifica se ela existe
  const turma = await Turma.findByPk(turmaId);
  if (!turma) {
    return res.status(404).json({ message: "Turma não encontrada." });
  }

  // Busca os alunos que pertencem à turma
  const alunos = await Aluno.findAll({
    include: [
      {
        model: Turma,
        where: { id: turmaId },
      },
    ],
  });

  // Retorna os alunos encontrados
  res.status(200).json(alunos);
});


/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /aluno/{id}:  
 *   get:  
 *     summary: Busca o aluno por id
 *     tags: [Alunos]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       404:
 *         description: Aluno não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */


router.get("/aluno/:id", async (req, res) => {
  const aluno = await Aluno.findOne({
    where: { id: req.params.id },
  });

  if (aluno) {
    res.status(200).json(aluno);
  } else {
    res.status(404).json({ message: "Aluno não encontrado." });
  }
});


/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /aluno:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       200:
 *         description: Cria um novo aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       404:
 *         description: Aluno não criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       500:
 *         description: Ocorreu um erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */



router.post("/aluno", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr, turmaId } = req.body;

  try {
    const turma = await Turma.findByPk(turmaId);
    if (turma) {
      const novoAluno = await Aluno.create({
        nome,
        dataNasc,
        telefone,
        email,
        numMatr,
        turmaId,
      });
      res.status(201).json(novoAluno);
    } else {
      res.status(404).json({ message: "Aluno não criado" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: "Ocorreu um erro interno." });
    }
  }
});


/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /aluno/{id}:
 *   put:
 *     summary: Edita as informações de um aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       200:
 *         description: Edita as informações de um aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       404:
 *         description: Aluno não foi encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       500:
 *         description: Ocorreu um erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */



router.put("/aluno/:id", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr } = req.body;
  const aluno = await Aluno.findByPk(req.params.id);
  try {
    if (aluno) {
      await Aluno.update(
        { nome, dataNasc, telefone, email, numMatr },
        { where: { id: req.params.id } }
      );
      res.status(200).json({ message: "Aluno atualizado com sucesso!" });
    } else {
      res.status(404).json({ message: "aluno não foi encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Um erro aconteceu, O campo deve não pode ser vazio!" });
  }
});


/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: O API de Gestão Escolar
 * /aluno/{id}:
 *   delete:
 *     summary: Deleta o aluno específico
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alunos'
 *     responses:
 *       200:
 *         description: Deleta o aluno específico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *       500:
 *         description: Ocorreu um erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alunos'
 *  
 */


router.delete("/aluno/:id", async (req, res) => {
  const { id } = req.params;
  const aluno = await Aluno.findOne({ where: { id } });
  try {
    if (aluno) {
      await Aluno.destroy({ where: { id } });
      res.status(200).json({ message: "Aluno removido con sucesso.", aluno });
    } else {
      res.status(404).json({ message: "Aluno não encontrado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Um erro inesperado aconteceu." });
  }
});

module.exports = router;
