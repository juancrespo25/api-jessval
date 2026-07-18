import express from 'express';
import { DespachoController } from './despacho.controller';
import { DespachoApplication } from '../../applications/despacho';
import { DespachoAdapter } from '../../adapters/despacho';
import { IDespachoPort } from '../../ports/despacho';

class DespachoRoutes {
  readonly router = express.Router();
  constructor(private readonly despachoController: DespachoController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', (req, res) => this.despachoController.findAll(req, res));
    this.router.post('/', (req, res) => this.despachoController.save(req, res));
  }
}

const port: IDespachoPort = new DespachoAdapter();
const application = new DespachoApplication(port);
const controller = new DespachoController(application);
export const despachoRoutes = new DespachoRoutes(controller).router;
