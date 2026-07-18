import express from 'express';
import { GuiaController } from './guia.controller';
import { GuiaApplication } from '../../applications/guia';
import { GuiaAdapter } from '../../adapters/guia';
import { IGuiaPort } from '../../ports/guia';

class GuiaRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: GuiaController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post('/', this.controller.create.bind(this.controller));
    this.router.get('/validate/:id_guia', this.controller.validateGuia.bind(this.controller));
  }
}

const port: IGuiaPort = new GuiaAdapter();
const application = new GuiaApplication(port);
const controller = new GuiaController(application);
export const guiaRoutes = new GuiaRoutes(controller).router;