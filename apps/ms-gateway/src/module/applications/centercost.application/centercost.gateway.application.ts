import { CenterCostGatewayPort } from '../../ports/centercost-gateway';

export class CenterCostGatewayApplication {

    constructor(private readonly port: CenterCostGatewayPort ){}

    create(descripcion: string, cliente: string, status: boolean, contacto: string, email: string, telefono: string, userCreated: string): Promise<any>{
        return this.port.create(descripcion, cliente, status, contacto, email, telefono, userCreated);
    }

    findAll(status: boolean): Promise<any>{
        return this.port.findAll(status);
    }

    findById(code: string): Promise<any>{
        return this.port.findById(code);
    }

    findByName(name: string): Promise<any>{
        return this.port.findByName(name);
    }

    update(descripcion: string, codigo: string, cliente: string,  status: boolean, contacto: string, email: string, telefono: string, userUpdated: string): Promise<any>{
        return this.port.update(descripcion, codigo, cliente, status, contacto, email, telefono, userUpdated);
    }

    delete(code: string, userUpdated: string): Promise<any>{
        return this.port.delete(code, userUpdated);
    }
}