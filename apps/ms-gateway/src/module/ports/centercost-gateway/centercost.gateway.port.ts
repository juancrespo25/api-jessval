export interface CenterCostGatewayPort {
    create(descripcion: string, cliente: string, status: boolean, contacto: string, email: string, telefono: string, user: string, password: string,  userCreated: string): Promise<any>;
    findAll(customer: string, status: boolean): Promise<any>;
    findById(code: string): Promise<any>;
    findByName(name: string, customer: string): Promise<any>;
    update(descripcion: string, codigo: string, cliente: string,  status: boolean, contacto: string, email: string, telefono: string, user: string, password: string, userUpdated: string): Promise<any>;
    delete(code: string, userUpdated: string): Promise<any>;
}