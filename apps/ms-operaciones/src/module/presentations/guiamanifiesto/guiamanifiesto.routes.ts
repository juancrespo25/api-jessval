import express from 'express';
import { GuiaManifiestoController } from './guiamanifiesto.controller';
import { GuiaManifiestoApplication } from '../../applications/guiamanifiesto';
import { GuiaManifiestoAdapter } from '../../adapters/guiamanifiesto';
import { IGuiaManifiestoPort } from '../../ports/guiamanifiesto';

class GuiaManifiestoRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: GuiaManifiestoController) {
    this.mountRoutes();
  }

  mountRoutes() {
    this.router.get('/validate/:id_guia', this.controller.validate.bind(this.controller));
  }
}

const port: IGuiaManifiestoPort = new GuiaManifiestoAdapter();
const application = new GuiaManifiestoApplication(port);
const controller = new GuiaManifiestoController(application);
export const guiaManifiestoRoutes = new GuiaManifiestoRoutes(controller).router;
