const Professor = require("../database/professor");
const {Router} = require("express")

const router = Router();


router.get("/professores", async (req,res) => {
    const listaProfessores = await Professor.findAll();
    res.json(listaProfessores);
});

router.get("/professor/:id", async (req, res) => {
    const professor = await Professor.findOne({ where: { id:req.params.id }
    })

    if(professor){
        res.json(professor);
    } else {
        res.status(404).json({message:"Professor não cadastrado!"})
    }

})

router.post("/professores", async (req, res) => {
    const {nome, dataNasc, telefone, email} = req.body;

    try{ 
        const novoProf = await Professor.create(
            {nome, dataNasc, telefone, email},

        );

        res.status(201).json(novoProf);
    } catch(err) {
        console.log(err);
        res.status(400).json({message: "Não foi possível cadastrar um novo professor."});
    }

})

router.put("/professor/:id", async (req, res) => {
    const {nome, dataNasc, telefone, email} = req.body;
    const {id} = req.params;

try {
    const professor = await Professor.findOne({ where: { id } });
    if(professor){
        await professor.update({nome, dataNasc, telefone, email});
        res.status(200).json({message:"Professor editado com sucesso!"})
    } else {
        res.status(404).json({message:"Professor não encontrado!"})
    }

} catch(err) {
    console.error(err)
    res.status(500).json ({message: "Um erro aconteceu!"})
}

});

module.exports =router; 