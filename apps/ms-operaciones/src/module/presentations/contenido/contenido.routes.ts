import express from 'express';
import { ContenidoController } from './contenido.controller';
import { ContenidoApplication } from '../../applications/contenido';
import { ContenidoAdapter } from '../../adapters/contenido';
import { IContenidoPort } from '../../ports/contenido';

class ContenidoRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: ContenidoController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
    this.router.patch('/', this.controller.update.bind(this.controller));
  }
}

const port: IContenidoPort = new ContenidoAdapter();
const application = new ContenidoApplication(port);
const controller = new ContenidoController(application);
export const contenidoRoutes = new ContenidoRoutes(controller).router;
