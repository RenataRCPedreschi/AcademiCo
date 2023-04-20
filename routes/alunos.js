const Aluno = require("../database/aluno");
const { Router } = require("express");
const Turma = require("../database/turma");
const { Op } = require("sequelize");


const router = Router();


router.get('/alunos', async (req, res) => {
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
    res.status(500).send('Erro ao buscar alunos');
  }
});



router.get('/alunos/turma/:id', async (req, res) => {
  const turmaId = req.params.id;

  // Busca a turma pelo ID e verifica se ela existe
  const turma = await Turma.findByPk(turmaId);
  if (!turma) {
    return res.status(404).json({ message: 'Turma não encontrada.' });
  }

  // Busca os alunos que pertencem à turma
  const alunos = await Aluno.findAll({
    include: [
      {
        model: Turma,
        where: { id: turmaId }
      }
    ]
  });

  // Retorna os alunos encontrados
  res.status(200).json(alunos);

})


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
    console.log(error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: 'Ocorreu um erro interno.' });
    }
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
    res.status(500).json({ message: 'Um erro aconteceu, O campo deve não pode ser vazio!' });
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
