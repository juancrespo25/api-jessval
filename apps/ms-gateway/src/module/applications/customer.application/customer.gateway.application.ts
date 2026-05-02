import { CustomerGatewayPort} from '../../ports/customer-gateway';

export class CustomerGatewayApplication {

    constructor(private readonly port: CustomerGatewayPort){}

    async create(descripcion: string, ruc: string, direccion: string, ubigeo: string, contacto: string, email: string, telefono: string, status: boolean, userCreated: string): Promise<any> {
        return await this.port.create(descripcion, ruc, direccion, ubigeo, contacto, email, telefono, status, userCreated);
    }

    async findAll(status: boolean): Promise<any> {
        return await this.port.findAll(status);
    }

    async findById(code: string): Promise<any> {
        return await this.port.findById(code);
    }

    async findByName(name: string): Promise<any> {
        return await this.port.findByName(name);
    }

    async update(code: string, descripcion: string, ruc: string, direccion: string, ubigeo: string, contacto: string, email: string, telefono: string, status: boolean, userUpdated: string): Promise<any> {
        return await this.port.update(code, descripcion, ruc, direccion, ubigeo, contacto, email, telefono, status, userUpdated);
    }

    async delete(code: string, userUpdated: string): Promise<any> {
        return await this.port.delete(code, userUpdated);
    }
}