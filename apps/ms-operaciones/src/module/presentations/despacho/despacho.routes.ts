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
    this.router.get('/', this.despachoController.findAll.bind(this.despachoController));
    this.router.get('/search/:id', this.despachoController.findById.bind(this.despachoController))
    this.router.post('/',  this.despachoController.save.bind(this.despachoController));
    this.router.put('/', this.despachoController.updateDespacho.bind(this.despachoController));
    this.router.put('/updatestatus', this.despachoController.updateDespachoStatus.bind(this.despachoController));
    this.router.put('/confirm', this.despachoController.confirmDespacho.bind(this.despachoController));
    this.router.post('/generar', this.despachoController.generarDespachos.bind(this.despachoController));
  }
}

const port: IDespachoPort = new DespachoAdapter();
const application = new DespachoApplication(port);
const controller = new DespachoController(application);
export const despachoRoutes = new DespachoRoutes(controller).router;
