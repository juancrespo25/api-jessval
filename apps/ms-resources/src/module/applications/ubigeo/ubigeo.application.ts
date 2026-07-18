import { IUbigeoPort } from '../../ports/ubigeo/ubigeo.port';
import { Ubigeo } from './ubigeo';

export class UbigeoApplication {
    constructor(private readonly ubigeoPort: IUbigeoPort){}

    async findByName(name: string): Promise<Ubigeo[]> {
        return await this.ubigeoPort.findByName(name);
    }

    async findByCode(code: string): Promise<Ubigeo | null> {
        return await this.ubigeoPort.findByCode(code);
    }
}