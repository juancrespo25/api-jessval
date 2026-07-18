import { IAuthPort } from '../ports';
import { Auth } from './auth';
import { AuthService } from './auth.service';

export class AuthApplication implements IAuthPort {

    constructor(private readonly port: IAuthPort){}
    async login(auth: Auth) {

        const response = await this.port.login(auth);

        const { data } = response;

        if(!data){
            return null;
        }

        const { nombres, apellidos, email, codigo } = data;

        if (await AuthService.compareToPassword(auth.properties.password, data.password)) {
            const token = await AuthService.generateAccessToken(nombres, apellidos, email, codigo );
            return token;
        }else{
            return null;
        }
    }

    async verifyToken(token: string): Promise<boolean> {
        return await AuthService.verifyToken(token);
    }
}