const Professor = require("../database/professor");
const { Router } = require("express");
const Joi = require("joi");

const router = Router();

router.post("/professores", async (req, res) => {
    // Define as regras de validação com Joi
    const schema = Joi.object({
        nome: Joi.string().required(),
        dataNasc: Joi.date().required(),
        telefone: Joi.string().required(),
        email: Joi.string().email().required(),
    });

    
    const { error } = schema.validate(req.body);

   
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try{ 
        const novoProf = await Professor.create(
            req.body
        );
        res.status(201).json(novoProf);
    } catch(err) {
        console.log(err);
        res.status(400).json({message: "Não foi possível cadastrar um novo professor."});
    }
});

module.exports = router;
module.exports = Professor;