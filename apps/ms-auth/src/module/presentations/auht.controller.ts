import { type Request, type Response } from "express";
import { plainToInstance } from "class-transformer";
import { Auth, AuthApplication } from "../applications";
import { validate} from 'class-validator';
import { AuthTokenDto } from "./dtos/auth-token.dto";
import { AuthLoginDto } from "./dtos";

export class AuthController {

    constructor(private readonly application: AuthApplication) {}

    async login(request: Request, response: Response) {

        const authDto = plainToInstance(AuthLoginDto, request.body);

        const errors = await validate(authDto);
        if (errors.length > 0) {
            return response.status(400).json({ status: 400, message: 'Validation failed', errors });
        }else {
            const auth = new Auth({...request.body});
            const token = await this.application.login(auth);

            if(token){
                return response.status(200).json({ status: 200, message: 'Login successful', token });
            }else{
                return response.status(401).json({ status: 401, message: 'Invalid credentials' });
            }
        }
    }

    async verifyToken(request: Request, response: Response) {

        const { token } = request.body;
        const authToken = plainToInstance(AuthTokenDto, request.body);
        const error = await validate(authToken);

        if (error.length > 0) {
            return response.status(400).json({ status: 400, message: 'Validation failed', errors: error });
        }

        if(!token){
            return response.status(400).json({ status: 400, message: 'Token not provided', data: null });
        }

        const isValid = await this.application.verifyToken(token);

        if (isValid) {
            return response.status(200).json({ status: 200, isValid, message: 'Token is valid' });
        } else {
            return response.status(401).json({ status: 401, message: 'Invalid token', data: null });
        }
    }
}
