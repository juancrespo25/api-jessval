import express from 'express';
import { ZonasController } from './zonas.controller';
import { ZonasApplication } from '../../applications/zonas';
import { ZonasAdapter } from '../../adapters/zonas';
import { IZonasPort } from '../../ports/zonas';

class ZonasRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: ZonasController) {
    this.mountRoutes();
  }

  mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: IZonasPort = new ZonasAdapter();
const application = new ZonasApplication(port);
const controller = new ZonasController(application);
export const zonasRoutes = new ZonasRoutes(controller).router;
