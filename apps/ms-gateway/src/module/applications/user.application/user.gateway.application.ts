import { UserGatewayPort } from '../../ports/user-gateway';

export class UserGatewayApplication {

    constructor(private readonly port: UserGatewayPort){}

    async create(nombres: string, apellidos: string, email: string, telefono: string, status: boolean, area: string, user_name: string, password: string, userCreated: string): Promise<any> {
        return await this.port.create(nombres, apellidos, email, telefono, status, area, user_name, password, userCreated);
    }

    async findAll(status: boolean): Promise<any> {
        return await this.port.findAll(status);
    }

    async findById(code: string): Promise<any> {
        return await this.port.findById(code);
    }

    async findByUsername(username: string): Promise<any> {
        return await this.port.findByUsername(username);
    }

    async delete(code: string, userDeleted: string): Promise<any> {
        return await this.port.delete(code, userDeleted);
    }

    async update(code: string, nombres: string, apellidos: string, email: string, telefono: string, status: boolean, area: string, user_name: string, password: string, userUpdated: string): Promise<any>{
        return await this.port.update(code, nombres, apellidos, email, telefono, status, area, user_name, password, userUpdated);
    }
}