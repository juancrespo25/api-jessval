export interface ProvinceGatewayPort {
    findByAll(status: string): Promise<any>;
}