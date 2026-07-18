import express from 'express';
import { GatewayController } from './gateway.controller';
import { GatewayAdapter } from '../../adapters/auth.adapter';
import { GatewayPort } from '../../ports/auth-gateway';
import { GatewayApplication } from '../../applications/auth.application';

export class GatewayRoutes {
    readonly router= express.Router();

    constructor(private readonly controller: GatewayController){
        this.mountRoute();
    }

    private mountRoute(){
        this.router.post('/login',  this.controller.login.bind(this.controller));
    }
}

const port: GatewayPort = new GatewayAdapter();
const application = new GatewayApplication(port);
const controller = new GatewayController(application);
export const gatewayRoutes = new GatewayRoutes(controller).router;