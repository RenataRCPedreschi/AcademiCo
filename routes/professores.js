const Professor = require("../database/professor");
const { Router } = require("express");
const Turma = require("../database/turma");

const router = Router();

router.get("/professores", async (req, res) => {
  const listaProfessores = await Professor.findAll();
  res.json(listaProfessores);
});

router.get("/professor/:id", async (req, res) => {
  const professor = await Professor.findOne({ where: { id: req.params.id } });

  if (professor) {
    res.json(professor);
  } else {
    res.status(404).json({ message: "Professor não cadastrado!" });
  }
});

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
    res
      .status(404)
      .json({ message: "Não foi possível cadastrar um novo professor." });
  }
});

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
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});

router.delete("/professor/:id", async (req,res) => {
  const {id} = req.params;
  const professor = await Professor.findOne({where: {id}});
  try {
      if(professor) {
          await professor.destroy();
          res.status(200).json({message: "Professor deletado com sucesso.", professor})
      }else{
          res.status(404).json({message: "Não foi possível excluir, professor não encontrado"})
      }
      } catch (err){
          console.error(err);
          res.status(500).json({message: "Um erro aconteceu"})
      }
  }
);

module.exports = router;
