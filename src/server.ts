import express, { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";

let petShops: PetShop[] = [];

const server = express();

server.use(cors());
server.use(express.json());

// Middleware para verificar se o petshop existe
function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.headers.cnpj as String;
    const petshop = petShops.find((petshop) => petshop.cnpj === cnpj);

    if (!petshop) {
        res.status(404).json({ error: "user not exists" });
        return;
    }

    // Adiciona o petshop no objeto da requisição para usar na rota
    req.petshop = petshop;
    next();
    return;
}

// Middleware para verificar se o petshop é igual
function checkUsersEquals(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj;
    const verificaPetshop = petShops.find((petshop) => petshop.cnpj === cnpj);

    if (verificaPetshop) {
        res.status(400).json({ message: "Já existe esse petshop! " });
        return;
    }
    
    req.petshop = req.body;
    next();
    return;
}

// Middleware para validar o cnpj
function validateCNPJ(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj;
    const regex =  /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/;
    const validacao = regex.test(cnpj);

    if (validacao) {
        req.body.cnpj = cnpj;
        next();
        return;
    }

    res.status(400).json({ error: "CNPJ inválido!" })
    return;
}

//criar Petshop
server.post("/petshops", checkUsersEquals, validateCNPJ, (req: Request, res: Response) => {
    const data = req.body as PetShop;

    const petshop: PetShop = {
        id: uuid(),
        name: data.name,
        cnpj: data.cnpj,
        pets: [],
    };

    petShops.push(petshop);
    res.status(201).json({ petshop });
    return;
});

//listar pets
server.get("/pets", checkExistsUserAccount, (req: Request, res: Response) => {
    res.status(200).json(petShops.map(petshop => petshop.pets));
    return;
});

//criar pet
server.post("/pets", checkExistsUserAccount, (req: Request, res: Response) => {
    const data = req.body as Pet;
    
    const petshopIndex = petShops.find((petshop) => petshop.cnpj === req.petshop.cnpj);

    const pet = {
        id: uuid(),
        name: data.name,
        type: data.type,
        description: data.description,
        vacinated: false,
        deadline_vacination: data.deadline_vacination,
        created_at: new Date(),
    }

    petshopIndex?.pets.push(pet);
    res.status(201).json({pet, message: 'Pet criado com sucesso!'})
    return;
});

//atualizar pet
server.put("/pets/:id", checkExistsUserAccount, (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type, description, deadline_vacination } = req.body;

    const pet = req.petshop.pets.find((pet) => pet.id === id);

    if (!pet) {
        res.status(404).json({ message: "Pet não encontrado!" })
        return;
    }

    pet.name = name || pet.name;
    pet.type = type || pet.type;
    pet.description = description || pet.description;
    pet.deadline_vacination = deadline_vacination || pet.deadline_vacination;

    res.status(200).json({ pet, message: "Pet atualizado com sucesso!" });
    return;
});

//atualizar status de vacinação
server.patch("/pets/:id/vaccinated", checkExistsUserAccount, (req: Request, res: Response) => {
    const { id } = req.params;

    const pet = req.petshop.pets.find((pet) => pet.id === id);

    if (!pet) {
        res.status(404).json({ message: "Pet não encontrado!" })
        return;
    }

    pet.vacinated = !pet.vacinated;

    res.status(200).json({ pet, message: "Status de vacinação atualizado com sucesso!" });
    return;
})


server.listen("3000", () =>
    console.log("server online on port 3000")
);