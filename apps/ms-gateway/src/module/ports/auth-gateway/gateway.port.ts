export type GatewayPort = {
    login(user_name: string, password: string): Promise<any>;
}