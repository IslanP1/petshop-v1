import express, { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";

let petShops: PetShop[] = [];

const server = express();

server.use(cors());
server.use(express.json());

//criar Petshop
server.post("/petshops", (req: Request, res: Response) => {
    const data = req.body as PetShop;

    const petshop: PetShop = {
        id: uuid(),
        name: data.name,
        cnpj: data.cnpj,
        pets: [],
    };

    petShops.push(petshop);
    res.status(201).json({ message: "Petshop criado com sucesso!" });
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
}) 

server.listen("3000", () =>
    console.log("server online on port 3000")
);