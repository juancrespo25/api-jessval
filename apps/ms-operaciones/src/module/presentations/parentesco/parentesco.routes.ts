import express from 'express';
import { ParentescoController } from './parentesco.controller';
import { ParentescoApplication } from '../../applications/parentesco';
import { ParentescoAdapter } from '../../adapters/parentesco';
import { IParentescoPort } from '../../ports/parentesco';

export class ParentescoRoutes {
  readonly router = express.Router();
  constructor(private readonly controller: ParentescoController) {
    this.mountRoutes();
  }
  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: IParentescoPort = new ParentescoAdapter();
const application = new ParentescoApplication(port);
const controller = new ParentescoController(application);
export const parentescoRoutes = new ParentescoRoutes(controller).router;