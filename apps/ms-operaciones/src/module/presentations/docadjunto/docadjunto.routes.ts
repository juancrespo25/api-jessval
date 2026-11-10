import express from 'express';
import { DocAdjuntoAdapter } from '../../adapters/docadjunto';
import { DocAdjuntoApplication } from '../../applications/docadjunto';
import { IDocAdjuntoPort } from '../../ports/docadjunto';
import { DocAdjuntoController } from './docadjunto.controller';

class DocAdjuntoRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: DocAdjuntoController) {
    this.router.post('/', this.controller.save.bind(this.controller));
  }
}

const port: IDocAdjuntoPort = new DocAdjuntoAdapter();
const application = new DocAdjuntoApplication(port);
const controller = new DocAdjuntoController(application);
export const docAdjuntoRoutes = new DocAdjuntoRoutes(controller).router;
