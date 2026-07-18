import express from 'express';
import { LineaController } from './linea.controller';
import { LineaApplication } from '../../applications/linea';
import { LineaAdapter } from '../../adapters/linea';
import { ILineaPort } from '../../ports/linea';

class LineaRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: LineaController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: ILineaPort = new LineaAdapter();
const application = new LineaApplication(port);
const controller = new LineaController(application);
export const lineaRoutes = new LineaRoutes(controller).router;
