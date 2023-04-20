const Aluno = require("../database/aluno");
const { Router } = require("express");

const router = Router();

router.get("/alunos", async (req, res) => {
  const listaAlunos = await Aluno.findAll();
  res.status(200).json(listaAlunos);
})


router.get("/alunos/:id", async (req, res) => {
  const aluno = await Aluno.findOne({
    where: { id: req.params.id }
  })

  if (aluno) {
    res.status(200).json(aluno)
  } else {
    res.status(404).json({ message: "Aluno não encontrado." })
  }

})

router.post("/alunos", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr } = req.body;

  try {
    const novoAluno = await Aluno.create(
      { nome, dataNasc, telefone, email, numMatr }
    );
    res.status(201).json(novoAluno)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Matrícula extistente, Impossível cadastra o mesmo aluno." })
  }
})
router.put("/alunos/:id", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr } = req.body;
  const aluno = await Aluno.findByPk(req.params.id);
  try {
    if (aluno) {
      await Aluno.update(
        { nome, dataNasc, telefone, email, numMatr },
        { where: { id: req.params.id } }
      )
    } else {
      res.status(404).json({ message: "aluno não foi encontrado" })
    }

  } catch (err) {
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});
module.exports = router;