/**
 * @swagger
 * components:
 *   schemas:
 *     Turmas: 
 *       type: object
 *       required:
 *       properties:
 *         id:
 *           type: bigint
 *           description: É automaticamente gerado um ID para a turma 
 *         CodTurma: 
 *           type: string  
 *           allowNull: false  
 *           validate: {notEmpty: {msg: "O código da turma é obrigatório."}} 
 *           description: Nome do Aluno 
 *         turno:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "O turno é obrigatório."}}
 *           description: Turno da turma
 *         disciplina:
 *           type: string
 *           allowNull: false
 *           validate: {notEmpty: {msg: "A disciplina é obrigatória."}}
 *           description: disciplina da turma
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
 *         codTurma: 520
 *         turno: noite
 *         disciplina: programação
 *         createdAt: 2023-04-20T14:23:41.438Z
 *         updatedAt: 2023-04-20T14:23:41.438Z
 *        
 */


const Aluno = require("../database/aluno");
const Professor = require("../database/professor");
const Turma = require("../database/turma");
const { Router } = require("express");

const router = Router();



/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: O API de Gestão Escolar
 * /turma:  
 *   post:  
 *     summary: Cria uma nova turma.
 *     tags: [Turmas]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/turma'
 *     responses:
 *       400:
 *         description: Mensagem personalizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma'
 *  
 */



router.post("/turma", async (req, res) => {
  const { codTurma, turno, disciplina } = req.body;

  try {
    const novaTurma = await Turma.create({ codTurma, turno, disciplina });
    res.status(201).json(novaTurma);
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: 'Ocorreu um erro interno.' });
    }
  }
});



/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: O API de Gestão Escolar
 * /turmas:  
 *   get:  
 *     summary: Lista todas as turmas
 *     tags: [Turmas]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/turmas'
 *     responses:
 *       404:
 *         description: Turma não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turmas'
 *  
 */



router.get("/turmas", async (req, res) => {
  const listaTurmas = await Turma.findAll();
  res.json(listaTurmas);
});


/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: O API de Gestão Escolar
 * /turma/{id}:  
 *   get:  
 *     summary: Busca a turma por ID.
 *     tags: [Turmas]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/turma/{id}'
 *     responses:
 *       404:
 *         description: Turma não encontrada!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma/{id}'
 *  
 */



router.get("/turma/:id", async (req, res) => {
  const { id } = req.params;

  const turmas = await Turma.findByPk(id);
  if (turmas) {
    res.json(turmas);
  } else {
    res.status(404).json({ message: "Turma não encontrada." });
  }
});



/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: O API de Gestão Escolar
 * /turma/{id}:  
 *   delete:  
 *     summary: Deleta a turma.
 *     tags: [Turmas]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/turma/{id}'
 *     responses:
 *       200: 
 *         description: Turma removida com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma/{id}'
 *       404:
 *         description: Turma não encontrada!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma/{id}'
 *  
 */


router.delete("/turma/:id", async (req, res) => {
  const { id } = req.params;
  const turma = await Turma.findOne({ where: { id } });

  try {
    if (turma) {
      await turma.destroy();
      res.status(200).json({ message: "Turma removida com sucesso!" })
    } else {
      res.status(404).json({ message: "Turma não encontrada!" })
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu!" })
  }

})


/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: O API de Gestão Escolar
 * /turma/{id}:  
 *   put:  
 *     summary: Edita a turma.
 *     tags: [Turmas]
 *     requestBody:
 *       required: true  
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/turma/{id}'
 *     responses:
 *       200: 
 *         description: Turma atualizada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma/{id}'
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/turma/{id}'
 *  
 */



router.put("/turma/:id", async (req, res) => {
  const { id } = req.params;

  const { codTurma, turno, disciplina } = req.body
  const turma = await Turma.findByPk(req.params.id);
  try {
    if (turma) {
      await Turma.update(
        { codTurma, turno, disciplina },
        { where: { id } }
      )
      res.status(200).json({ message: "Turma atualizada com sucesso!" })
    } else {
      res.status(404).json({ message: "Turma não encontrada" })
    }

  } catch (err) {
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});

module.exports = router;
