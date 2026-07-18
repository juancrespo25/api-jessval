import { CenterCostGatewayPort } from '../../ports/centercost-gateway';

export class CenterCostGatewayApplication {

    constructor(private readonly port: CenterCostGatewayPort ){}

    create(descripcion: string, cliente: string, status: boolean, contacto: string, email: string, telefono: string, user: string, password: string, userCreated: string): Promise<any>{
        return this.port.create(descripcion, cliente, status, contacto, email, telefono, user, password, userCreated);
    }

    findAll(customer: string, status: boolean): Promise<any>{
        return this.port.findAll(customer, status);
    }

    findById(code: string): Promise<any>{
        return this.port.findById(code);
    }

    findByName(name: string, customer: string): Promise<any>{
        return this.port.findByName(name, customer);
    }

    update(descripcion: string, codigo: string, cliente: string,  status: boolean, contacto: string, email: string, telefono: string, user: string, password: string, userUpdated: string): Promise<any>{
        return this.port.update(descripcion, codigo, cliente, status, contacto, email, telefono, user, password, userUpdated);
    }

    delete(code: string, userUpdated: string): Promise<any>{
        return this.port.delete(code, userUpdated);
    }
}