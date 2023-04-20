const Aluno = require("../database/aluno");
const Professor = require("../database/professor");
const Turma = require("../database/turma");
const { Router } = require("express");

const router = Router();

//Inserção de turma
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

//listar turmas
router.get("/turmas", async (req, res) => {
  const listaTurmas = await Turma.findAll();
  res.json(listaTurmas);
});

//listar uma turma
router.get("/turma/:id", async (req, res) => {
  const { id } = req.params;

  const turmas = await Turma.findByPk(id);
  if (turmas) {
    res.json(turmas);
  } else {
    res.status(404).json({ message: "Turma não encontrada." });
  }
});

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

//Atualizar a informação da turma
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
