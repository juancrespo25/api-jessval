import { ICentroCostoPort } from "../ports/centrocosto.port";
import { CentroCosto } from "./centrocosto";

export class CentroCostoApplication {

    constructor(private readonly centroCostoPort: ICentroCostoPort) {}

    async create(centroCosto: CentroCosto): Promise<CentroCosto> {
        return await this.centroCostoPort.create(centroCosto);
    }

    async findAll(status?: boolean): Promise<CentroCosto[]> {
        return await this.centroCostoPort.findAll(status);
    }

    async findById(code: string): Promise<CentroCosto | null> {
        return await this.centroCostoPort.findById(code);
    }

    async update(centroCosto: CentroCosto): Promise<CentroCosto> {
        return await this.centroCostoPort.update(centroCosto);
    }

    async delete(code: string, userUpdate: string): Promise<boolean> {
        return this.centroCostoPort.delete(code, userUpdate);
    }

    async findByName(name: string): Promise<CentroCosto[]> {
        return await this.centroCostoPort.findByName(name);
    }

}