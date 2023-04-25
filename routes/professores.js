/**
 * @swagger
 * components:
 *   schemas:
 *     Professores: 
 *       type: object
 *       required:
 *       properties:
 *         id:
 *           type: bigint
 *           description: É automaticamente gerado um ID para o professor 
 *         nome: 
 *           type: string  
 *           allowNull: false  
 *           validate: {notEmpty: {msg: "O nome é obrigatório."}, len: {args: [2, 100], msg: "O nome deve ter entre 2 e 100 caracteres."}} 
 *           description: Nome do Professor 
 *         dataNasc:
 *           type: dateonly
 *           allowNull: false
 *           validate: {notEmpty: {msg: "Por favor, insira a data de nascimento do professor."}, isDate: {msg: "Por favor, insira uma data de nascimento válida."}}
 *           description: Nascimento do professor
 *         telefone:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "Por favor, insira o telefone do professor."}, len: [1,18], {msg: "O telefone do professor deve ter entre 1 e 18 caracteres."}}
 *           description: telefone do professor
 *         email:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "Por favor, insira o e-mail do professor."}, isEmail: {msg: "Por favor, insira um e-mail válido."}}
 *           description: email do aluno
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Data que o professor foi cadastrado na plataforma
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Ultima data que os dados do professor foram atualizados
 *       example:  
 *         id: 1
 *         nome: João
 *         dataNasc: 2000-05-30
 *         telefone: (11) 95544-3322
 *         email: joao@gmail.com
 *         createdAt: 2023-04-20T14:23:41.438Z
 *         updatedAt: 2023-04-20T14:23:41.438Z
 *        
 */


const Professor = require("../database/professor");
const { Router } = require("express");
const Turma = require("../database/turma");
const { Op } = require("sequelize");

const router = Router();



/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: O API de Gestão Escolar
 * /professores:  
 *   get:  
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       500:
 *         description: Erro ao buscar os professores.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *  
 */


router.get("/professores", async (req, res) => {
  const { nome, dataNasc, telefone, email, turmaId } = req.query;
  const where = {};

  if (nome) where.nome = { [Op.like]: `%${nome}%` };
  if (dataNasc) where.dataNasc = dataNasc;
  if (telefone) where.telefone = telefone;
  if (email) where.email = email;
  if (turmaId) where.turmaId = turmaId;

  try {
    const listaProfessores = await Professor.findAll({ where });
    res.json(listaProfessores);
  } catch (error) {
    res.status(500).send("Erro ao buscar os professores");
  }
});


/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: O API de Gestão Escolar
 * /professor/{id}:  
 *   get:  
 *     summary: Lista o professor por ID.
 *     tags: [Professores]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       404:
 *         description: Professor não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *  
 */


router.get("/professor/:id", async (req, res) => {
  const professor = await Professor.findOne({ where: { id: req.params.id } });

  if (professor) {
    res.json(professor);
  } else {
    res.status(404).json({ message: "Professor não cadastrado!" });
  }
});


/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: O API de Gestão Escolar
 * /professores:  
 *   post:  
 *     summary: Cadastra um novo professor.
 *     tags: [Professores]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       200: 
 *         description: Professor criado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       400:
 *         description: Mensagem personalizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       500:
 *         description: Um erro interno aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *  
 */


router.post("/professor", async (req, res) => {
  const { nome, dataNasc, telefone, email, turmaId } = req.body;

  try {
    const turma = await Turma.findByPk(turmaId);
    if (turma) {
      const novoProf = await Professor.create({
        nome,
        dataNasc,
        telefone,
        email,
        turmaId,
      });
      res.status(201).json(novoProf);
    } else {
      res.status(404).json({ message: "Professor não criado" });
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
 *   name: Professores
 *   description: O API de Gestão Escolar
 * /professor/{id}:  
 *   put:  
 *     summary: Edita as informações do professor.
 *     tags: [Professores]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       200: 
 *         description: Professor editado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores' 
 *       404:
 *         description: Professor não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       500:
 *         description: Um erro aconteceu, O campo deve não pode ser vazio!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 */


router.put("/professor/:id", async (req, res) => {
  const { nome, dataNasc, telefone, email } = req.body;
  const { id } = req.params;

  try {
    const professor = await Professor.findOne({ where: { id } });
    if (professor) {
      await professor.update({ nome, dataNasc, telefone, email });
      res.status(200).json({ message: "Professor editado com sucesso!" });
    } else {
      res.status(404).json({ message: "Professor não encontrado!" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Um erro aconteceu, O campo deve não pode ser vazio!" });
  }
});



/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: O API de Gestão Escolar
 * /professor/{id}:  
 *   delete:  
 *     summary: Deleta o professor.
 *     tags: [Professores]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       200: 
 *         description: Professor deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores' 
 *       404:
 *         description: Não foi possível excluir, professor não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       500:
 *         description: Um erro aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 */


router.delete("/professor/:id", async (req, res) => {
  const { id } = req.params;
  const professor = await Professor.findOne({ where: { id } });
  try {
    if (professor) {
      await professor.destroy();
      res
        .status(200)
        .json({ message: "Professor deletado com sucesso.", professor });
    } else {
      res.status(404).json({
        message: "Não foi possível excluir, professor não encontrado",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu" });
  }
});

module.exports = router;
