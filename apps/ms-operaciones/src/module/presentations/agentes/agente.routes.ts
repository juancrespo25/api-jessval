import express from 'express';
import { AgenteController } from './agente.controller';
import { AgenteApplication } from '../../applications/agentes';
import { AgenteAdapter } from '../../adapters/agentes';
import { IAgentePort } from '../../ports/agentes';

export class AgenteRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: AgenteController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
  }
}


const port: IAgentePort = new AgenteAdapter();
const application = new AgenteApplication(port);
const controller = new AgenteController(application);
export const agenteRoutes = new AgenteRoutes(controller).router;