import express from 'express';
import { ManifiestoController } from './manifiesto.controller';
import { ManifiestoApplication } from '../../applications/manifiesto';
import { ManifiestoAdapter } from '../../adapters/manifiesto';
import { IManifiestoPort } from '../../ports/manifiesto';

class ManifiestoRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: ManifiestoController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post('/', this.controller.create.bind(this.controller));
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.get('/:codigo', this.controller.findByCodigo.bind(this.controller));
    this.router.put('/', this.controller.update.bind(this.controller));
  }
}

const port: IManifiestoPort = new ManifiestoAdapter();
const application = new ManifiestoApplication(port);
const controller = new ManifiestoController(application);
export const manifiestoRoutes = new ManifiestoRoutes(controller).router;