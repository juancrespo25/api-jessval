import express from 'express';
import { UserGatewayController } from './user.gateway.controller';
import { UserGatewayAdapter } from '../../adapters/user.adapter';
import { UserGatewayPort } from '../../ports/user-gateway';
import { UserGatewayApplication } from '../../applications/user.application';
import { AuthMiddleware } from '../../../core/middlewares';

export class UserGatewayRoutes {
    readonly router = express.Router()

    constructor(private readonly controller: UserGatewayController ){
        this.mountRoutes()
    }

    private mountRoutes(){
        this.router.post('/user', AuthMiddleware.canActivate, this.controller.create.bind(this.controller));
        this.router.get('/user', AuthMiddleware.canActivate, this.controller.findAll.bind(this.controller));
        this.router.get('/user/:code', AuthMiddleware.canActivate, this.controller.findById.bind(this.controller));
        this.router.delete('/user', AuthMiddleware.canActivate, this.controller.delete.bind(this.controller));
        this.router.patch('/user', AuthMiddleware.canActivate, this.controller.update.bind(this.controller));
    }
}

const port: UserGatewayPort = new UserGatewayAdapter();
const application = new UserGatewayApplication(port);
const controller = new UserGatewayController(application);
export const userGatewayRoutes = new UserGatewayRoutes(controller).router;