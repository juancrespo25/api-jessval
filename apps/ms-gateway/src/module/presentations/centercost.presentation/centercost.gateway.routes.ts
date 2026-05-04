import express from 'express';
import { CentroCostoGatewayController } from './centercosto.gateway.controller';
import { CenterCostGatewayAdapter } from '../../adapters/centercost.adapter';
import { CenterCostGatewayPort } from '../../ports/centercost-gateway';
import { CenterCostGatewayApplication } from '../../applications/centercost.application';
import { AuthMiddleware } from '../../../core/middlewares';

export class CenterCostGatewayRoutes{
    
    readonly  router = express.Router()
    constructor(private readonly controller: CentroCostoGatewayController) {
        this.mountRoutes();
    }

    private mountRoutes(){
        this.router.post('/centercost', AuthMiddleware.canActivate, this.controller.create.bind(this.controller));
        this.router.get('/centercost', AuthMiddleware.canActivate, this.controller.findAll.bind(this.controller));
        this.router.get('/centercost/:code', AuthMiddleware.canActivate, this.controller.findById.bind(this.controller));
        this.router.delete('/centercost', AuthMiddleware.canActivate, this.controller.delete.bind(this.controller));
        this.router.patch('/centercost', AuthMiddleware.canActivate, this.controller.update.bind(this.controller));
    }
}

const port: CenterCostGatewayPort = new CenterCostGatewayAdapter();
const application = new CenterCostGatewayApplication(port);
const controller = new CentroCostoGatewayController(application);
export const centerCostGatewayRoutes = new CenterCostGatewayRoutes(controller).router;