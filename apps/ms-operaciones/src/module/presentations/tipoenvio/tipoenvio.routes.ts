import express from 'express';
import { TipoEnvioController } from './tipoenvio.controller';
import { TipoEnvioApplication } from '../../applications/tipoenvio';
import { TipoEnvioAdapter } from '../../adapters/tipoenvio';
import { ITipoEnvioPort } from '../../ports/tipoenvio';

class TipoEnvioRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: TipoEnvioController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: ITipoEnvioPort = new TipoEnvioAdapter();
const application = new TipoEnvioApplication(port);
const controller = new TipoEnvioController(application);
export const tipoEnvioRoutes = new TipoEnvioRoutes(controller).router;
