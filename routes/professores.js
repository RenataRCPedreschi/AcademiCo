const Professor = require("../database/professor");
const {Router} = require("express")

const router = Router();

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

});

module.exports =router;