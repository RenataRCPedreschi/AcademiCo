const Aluno = require("../database/aluno");
const Professor = require("../database/professor");
const Turma = require("../database/turma");
const { Router } = require("express");

const router = Router();

//Inserção de turma
router.post("/turmas", async (req, res) => {
  const { codTurma } = req.body;

  try {
    const aluno = await Aluno.findByPk(alunoId);
    const professor = await Professor.findByPk(professorId);
    if (aluno && professor) {
      const novaTurma = await Turma.create({ codTurma });
      res.status(201).json(novaTurma)
    }else{
        res.status(404).json({ message: "Professor ou aluno não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//listar turmas
router.get("/turmas", async (req, res) => {
    const listaTurmas = await Turma.findAll();
    res.json(listaTurmas);
  });


//listar uma turma
router.get("/turmas/:id", async (req, res) => {
    const { id } = req.params;
  
    const turmas = await Turma.findByPk(id);
    if (turmas) {
      res.json(turmas);
    } else {
      res.status(404).json({ message: "Turma não encontrado." });
    }
  });

module.exports = router;