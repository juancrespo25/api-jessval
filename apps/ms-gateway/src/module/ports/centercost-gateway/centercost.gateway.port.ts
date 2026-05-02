export interface CenterCostGatewayPort {
    create(descripcion: string, cliente: string, status: boolean, contacto: string, email: string, telefono: string, userCreated: string): Promise<any>;
    findAll(status: boolean): Promise<any>;
    findById(code: string): Promise<any>;
    findByName(name: string): Promise<any>;
    update(descripcion: string, codigo: string, cliente: string,  status: boolean, contacto: string, email: string, telefono: string, userUpdated: string): Promise<any>;
    delete(code: string, userUpdated: string): Promise<any>;
}