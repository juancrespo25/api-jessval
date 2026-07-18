import {UbigeoGatewayPort} from "../../ports/ubigeo-gateway";

export class UbigeoGatewayApplication {
    constructor(private readonly port: UbigeoGatewayPort){}

    async findByName(name: string): Promise<any> {
        return await this.port.findByName(name);
    }

    async findByCode(code: string): Promise<any> {
        return await this.port.findByCode(code);
    }
}