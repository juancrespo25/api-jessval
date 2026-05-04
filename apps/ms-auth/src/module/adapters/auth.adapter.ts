import { Auth} from '../applications';
import { IAuthPort } from '../ports';

import { env } from '../../env';

export class AuthAdapter implements IAuthPort {
    async login(auth: Auth): Promise<any> {
        const { user_name } = auth.properties;

        const response = await fetch(`${env.SERVICE_NAME_USER}/user/username/${user_name}`);
        if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
}