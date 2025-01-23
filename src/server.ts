import express, { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { error } from "console";

let petShops: PetShop[] = [];

const server = express();

server.use(cors());
server.use(express.json());

// Middleware para verificar se o petshop existe
function checkExistsUserAccount(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj as string;
    console.log(cnpj);

    const petshop = petShops.find((petshop) => petshop.cnpj === cnpj);

    if (!petshop) {
        res.status(404).json({ error: "user not exists" });
        return;
    }

    // Adiciona o petshop no objeto da requisição para usar na rota
    req.petshop = petshop;
    next();
}

function checkUsersEquals(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj;
    const verificaPetshop = petShops.find((petshop) => petshop.cnpj === cnpj);

    if (verificaPetshop) {
        res.status(400).json({ message: "Já existe esse petshop! " });
        return;
    }
    
    req.petshop = req.body;
    next();
}


function validarCNPJ(req: Request, res: Response, next: NextFunction) {
    const cnpj = req.body.cnpj;
    console.log(cnpj)
    const regex =  /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/;
    const validacao = regex.test(cnpj);

    if (validacao) {
        req.body.cnpj = cnpj;
        next();
    }

    res.status(400).json({ error: "CNPJ inválido!" })
    return;
}

//criar Petshop
server.post("/petshops", checkUsersEquals, validarCNPJ, (req: Request, res: Response) => {
    const data = req.body as PetShop;

    const petshop: PetShop = {
        id: uuid(),
        name: data.name,
        cnpj: data.cnpj,
        pets: [],
    };

    petShops.push(petshop);
    res.status(201).json({ petshop})
    return;
});

//criar pet
server.post("/petshop/:id/pet", (req: Request, res: Response) => {
    const petshopId = req.params.id;
    const data = req.body as Pet;

    const petshopIndex = petShops.find((petshop) => petshop.id === petshopId);

    if (petshopIndex) {
        const pet = {
            id: uuid(),
            name: data.name,
            type: data.type,
            description: data.description,
            vacinated: data.vacinated,
            deadline_vacination: data.deadline_vacination,
            created_at: new Date(),
        };

        petshopIndex.pets.push(pet);
        res.status(201).json({ message: "Pet criado com sucesso!" });
    } else {
        res.status(404).json({ message: "Petshop não encontrado!" });
    }
});


//listar petshops
server.get("/petshops", (req: Request, res: Response) => {
    res.status(200).json(petShops);
});

//listar pets
server.get("/petshop/:id/pets", (req: Request, res: Response) => {
    const petshopId = req.params.id;

    const petshopIndex = petShops.find((petshop) => petshop.id === petshopId);

    if (petshopIndex) {
        res.status(200).json(petshopIndex.pets);
    } else {
        res.status(404).json({ message: "Petshop não encontrado!" });
    };
});

//atualizar petshop
server.put("/petshop/:id", (req: Request, res: Response) => {
    const petshopId = req.params.id;

    const petshopIndex = petShops.find((petshop) => petshop.id === petshopId);

    if (petshopIndex) {
        petshopIndex.name = req.body.name;
        petshopIndex.cnpj = req.body.cnpj;
        res.status(200).json({ message: "Petshop atualizado com sucesso!" });
    } else {
        res.status(404).json({ message: "Petshop não encontrado!" });
    };
});

//atualizar pet
server.put("/petshop/:id/pet/:id-pet", (req: Request, res: Response) => {
    const petshopId = req.params.id;






})



server.listen("3000", () =>
    console.log("server online on port 3000")
);