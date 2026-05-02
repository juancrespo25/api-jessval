export interface CustomerGatewayPort {
    create(descripcion: string, ruc: string, direccion: string, ubigeo: string, contacto: string, email: string, telefono: string, status: boolean, userCreated: string): Promise<any>;
    findAll(status: boolean): Promise<any>;
    findById(code: string): Promise<any>;
    findByName(name: string): Promise<any>;
    update(code: string, descripcion: string, ruc: string, direccion: string, ubigeo: string, contacto: string, email: string, telefono: string, status: boolean, userUpdated: string): Promise<any>;
    delete(code: string, userUpdated: string): Promise<any>;
}