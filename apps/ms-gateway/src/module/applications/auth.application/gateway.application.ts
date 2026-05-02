import { GatewayPort } from '../../ports/auth-gateway';

export class GatewayApplication {
    constructor(private readonly port: GatewayPort) {}

    async login(user_name: string, password: string): Promise<any> {
        return await this.port.login(user_name, password);
    }
}