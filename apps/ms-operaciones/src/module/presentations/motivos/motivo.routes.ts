import express from 'express';
import { MotivoController } from './motivo.controller';
import { MotivoApplication } from '../../applications/motivos';
import { MotivoAdapter } from '../../adapters/motivos';
import { IMotivoPort } from '../../ports/motivos';

class MotivoRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: MotivoController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: IMotivoPort = new MotivoAdapter();
const application = new MotivoApplication(port);
const controller = new MotivoController(application);
export const motivoRoutes = new MotivoRoutes(controller).router;