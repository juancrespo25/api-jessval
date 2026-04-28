import { CentroCosto } from "../applications";

export interface ICentroCostoPort {
    create(centroCosto: CentroCosto): Promise<CentroCosto>;
    findAll(status?: boolean): Promise<CentroCosto[]>;
    findById(code: string): Promise<CentroCosto | null>;
    findByName(name: string): Promise<CentroCosto[]>;
    update(centroCosto: CentroCosto): Promise<CentroCosto>;
    delete(code: string, userUpdate: string): Promise<boolean>;
}