export interface UserGatewayPort {
    create(nombres: string, apellidos: string, email: string, telefono: string, status: boolean, area: string, user_name: string, password: string, userCreated: string): Promise<any>;
    findAll(status: boolean): Promise<any>;
    findById(code: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    update(codigo: string, nombres: string, apellidos: string, email: string, telefono: string, status: boolean, area: string, user_name: string, password: string, userUpdated: string): Promise<any>;
    delete(codigo: string, userDeleted: string): Promise<any>;
}