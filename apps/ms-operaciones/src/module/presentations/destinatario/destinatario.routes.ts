import express from 'express';
import { DestinatarioController } from './destinatario.controller';
import { DestinatarioApplication } from '../../applications/destinatario';
import { DestinatarioAdapter } from '../../adapters/destinatario';
import { IDestinatarioPort } from '../../ports/destinatario';

class DestinatarioRoutes {

  readonly router = express.Router();

  constructor(private readonly controller: DestinatarioController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post('/', this.controller.findByName.bind(this.controller));
  }
}

const port: IDestinatarioPort = new DestinatarioAdapter();
const application = new DestinatarioApplication(port);
const controller = new DestinatarioController(application);
export const destinatarioRoutes = new DestinatarioRoutes(controller).router;