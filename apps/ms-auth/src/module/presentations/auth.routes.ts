import express from 'express';
import { AuthController } from './auht.controller';
import { IAuthPort } from '../ports';
import { AuthAdapter } from '../adapters';
import { AuthApplication } from '../applications';

class AuthRoutes {
    readonly router = express.Router();

    constructor(private readonly controller: AuthController) {
        this.mountRoutes();
    }

    private mountRoutes(){
        this.router.post('/', this.controller.login.bind(this.controller));
        this.router.post('/verify-token', this.controller.verifyToken.bind(this.controller));
    }
}

const port: IAuthPort = new AuthAdapter();
const application = new AuthApplication(port);
const controller = new AuthController(application);
export const authRoutes = new AuthRoutes(controller).router;