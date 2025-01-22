type Pet = {
    id: string;
    name: string;
    type: string;
    description: string;
    vacinated: boolean;
    deadline_vacination: Date;
    created_at: Date;
};

type PetShop = {
    id: string;
    name: string;
    cnpj: string;
    pets: Pet[];
};

declare namespace Express {
    export interface Request {
        pet: Pet;
        petshop: PetShop;
    }
}
