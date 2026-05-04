import express from 'express';
import { CustomerGatewayController } from './customer.gateway.controller';
import { CustomerGatewayAdapter } from '../../adapters/customer.adapter';
import { CustomerGatewayPort } from '../../ports/customer-gateway';
import { CustomerGatewayApplication } from '../../applications/customer.application';
import { AuthMiddleware } from '../../../core/middlewares';

export class CustomerGatewayRoutes {
    readonly router = express.Router();

    constructor(private readonly controller: CustomerGatewayController) {
        this.mountRoutes();
    }

    private mountRoutes(){
        this.router.post('/customer', AuthMiddleware.canActivate, this.controller.create.bind(this.controller));
        this.router.get('/customer', AuthMiddleware.canActivate, this.controller.findAll.bind(this.controller));
        this.router.get('/customer/:code', AuthMiddleware.canActivate, this.controller.findById.bind(this.controller));
        this.router.delete('/customer', AuthMiddleware.canActivate, this.controller.delete.bind(this.controller));
        this.router.patch('/customer', AuthMiddleware.canActivate, this.controller.update.bind(this.controller));
    }
}

const port: CustomerGatewayPort = new CustomerGatewayAdapter();
const application = new CustomerGatewayApplication(port);
const controller = new CustomerGatewayController(application);
export const customerGatewayRoutes = new CustomerGatewayRoutes(controller).router;