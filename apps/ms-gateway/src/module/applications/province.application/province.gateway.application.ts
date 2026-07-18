import { ProvinceGatewayPort } from '../../ports/province.port';

export class ProvinceGatewayApplication {
    constructor(private readonly port: ProvinceGatewayPort) {}

    async findByAll(status: string): Promise<any> {
        return await this.port.findByAll(status)
    }
}