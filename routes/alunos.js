const Aluno = require("../database/aluno");
const { Router } = require("express");
const Turma = require("../database/turma");

const router = Router();

router.get('/alunos', async (req, res) => {
  const listaAlunos = await Aluno.findAll();
  res.status(200).json(listaAlunos);
});

router.get('/aluno/:id', async (req, res) => {
  const aluno = await Aluno.findOne({
    where: { id: req.params.id }
  });

  if (aluno) {
    res.status(200).json(aluno);
  } else {
    res.status(404).json({ message: 'Aluno não encontrado.' });
  }
});



router.post("/aluno", async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr, turmaId } = req.body;

  try {
    const turma = await Turma.findByPk(turmaId)
    if(turma){
      const novoAluno = await Aluno.create(
      { nome, dataNasc, telefone, email, numMatr, turmaId });
    res.status(201).json(novoAluno)
  }else{
    res.status(404).json({ message: "Aluno não criado"});
  }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Matrícula existente, Impossível cadastrar o mesmo aluno." })
  }
});

router.put('/aluno/:id', async (req, res) => {
  const { nome, dataNasc, telefone, email, numMatr } = req.body;
  const aluno = await Aluno.findByPk(req.params.id);
  try {
    if (aluno) {
      await Aluno.update(
        { nome, dataNasc, telefone, email, numMatr },
        { where: { id: req.params.id } }
      );
      res.status(200).json({message:"Aluno atualizado com sucesso!"});
    } else {
      res.status(404).json({ message: 'aluno não foi encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Um erro aconteceu!' });
  }
});

router.delete('/aluno/:id', async (req, res) => {
  const { id } = req.params;
  const aluno = await Aluno.findOne({ where: { id } });
  try {
    if (aluno) {
      await Aluno.destroy({ where: { id } });
      res.status(200).json({ message: 'Aluno removido con sucesso.',aluno });
    } else {
      res.status(404).json({ message: 'Aluno não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Um erro inesperado aconteceu.' });
  }
});

module.exports = router;
