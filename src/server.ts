import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

type Pet = {
    id: number;
    name: string;
    type: string;
    description: string;
    vacinated: boolean;
    deadline_vacination: Date;
    created_at: Date;
};

type PetShop = {
    id: number;
    name: string;
    cnpj: string;
    pets: Pet[];
};

let petShops: PetShop[] = [];

const server = express();

server.use(cors());
server.use(express.json());

server.listen("3000", () =>
    console.log("server online on port 3000")
);