import express from 'express';
import { UbigeoGatewayController } from './ubigeo.gateway.controller';
import { UbigeoGatewayAdapter } from '../../adapters/ubigeo.adapter/ubigeo.gateway.adapter';
import { UbigeoGatewayPort } from '../../ports/ubigeo-gateway/ubigeo.gateway.port';
import { UbigeoGatewayApplication } from '../../applications/ubigeo.application/ubigeo.gateway.application';
import { AuthMiddleware } from '../../../core/middlewares';

export class UbigeoGatewayRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: UbigeoGatewayController){
    this.mountRoutes();
  }

  private mountRoutes(){
    this.router.get('/recursos/ubigeo/name/:name', AuthMiddleware.canActivate, this.controller.findByName.bind(this.controller));
    this.router.get('/recursos/ubigeo/code/:code', AuthMiddleware.canActivate, this.controller.findByCode.bind(this.controller));
  }
}

const port: UbigeoGatewayPort = new UbigeoGatewayAdapter();
const application = new UbigeoGatewayApplication(port);
const controller = new UbigeoGatewayController(application);
export const ubigeoGatewayRoutes = new UbigeoGatewayRoutes(controller).router;