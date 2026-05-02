import { GatewayPort } from '../../ports/auth-gateway';
import { env } from '../../../env';

export class GatewayAdapter implements GatewayPort {

    async login(user_name: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${env.URL_AUTH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_name, password }),
            });

            return await response.json();
        } catch (error) {
            console.error('Error connecting to auth service:', error);
            throw new Error('Failed to connect to auth service');
        }
    }
}