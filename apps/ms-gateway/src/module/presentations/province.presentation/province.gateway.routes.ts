import express from 'express';
import { ProvinceGatewayController } from './province.gateway.controller';
import { ProvinceGatewayAdapter } from '../../adapters/province.adapter';
import { ProvinceGatewayPort } from '../../ports/province.port';
import { ProvinceGatewayApplication } from '../../applications/province.application';
import { AuthMiddleware } from '../../../core/middlewares';

export class ProvinceGatewayRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: ProvinceGatewayController){
    this.mountRoutes();
  }

  private mountRoutes(){
    this.router.get('/recursos/provincia', AuthMiddleware.canActivate, this.controller.findByAll.bind(this.controller));
  }
}

const port: ProvinceGatewayPort = new ProvinceGatewayAdapter();
const application = new ProvinceGatewayApplication(port);
const controller = new ProvinceGatewayController(application);
export const provinceGatewayRoutes = new ProvinceGatewayRoutes(controller).router;