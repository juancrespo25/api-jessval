import { Ubigeo } from "../../applications/ubigeo"

export interface IUbigeoPort {
    findByName(name: string): Promise<Ubigeo[]>;
    findByCode(code: string): Promise<Ubigeo | null>;
}