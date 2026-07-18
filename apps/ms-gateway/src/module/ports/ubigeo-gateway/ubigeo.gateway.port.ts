export interface UbigeoGatewayPort {
    findByName(name: string): Promise<any>;
    findByCode(code: string): Promise<any>;
}