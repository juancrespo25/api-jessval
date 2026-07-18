import { CentroCosto } from "../applications";

export interface ICentroCostoPort {
    create(centroCosto: CentroCosto): Promise<CentroCosto>;
    findAll(customer: string, status?: boolean): Promise<CentroCosto[]>;
    findById(code: string): Promise<CentroCosto | null>;
    findByName(name: string, customer: string): Promise<CentroCosto[]>;
    update(centroCosto: CentroCosto): Promise<CentroCosto>;
    delete(code: string, userUpdate: string): Promise<boolean>;
}