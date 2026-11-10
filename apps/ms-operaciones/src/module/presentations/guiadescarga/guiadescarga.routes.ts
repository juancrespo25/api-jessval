import express from 'express';
import { GuiaDescargaController } from './guiadescarga.controller';
import { GuiaDescargaApplication } from '../../applications/guiadescarga';
import { GuiaDescargaAdapter } from '../../adapters/guiadescarga/guiadescarga.adapter';
import { IGuiaDescargaPort } from '../../ports/guiadescarga';

export class GuiaDescargaRoutes {

  readonly router = express.Router();

  constructor(private readonly controller: GuiaDescargaController){
    this.mountRoutes();
  }

  mountRoutes(){
    this.router.post('/', this.controller.save.bind(this.controller));
    this.router.get('/:tipo', this.controller.getAllType.bind(this.controller));
    this.router.get('/id/:id_guia', this.controller.getById.bind(this.controller));
    this.router.put('/', this.controller.update.bind(this.controller));
  }
}

const port: IGuiaDescargaPort = new GuiaDescargaAdapter();
const application = new GuiaDescargaApplication(port);
const controller = new GuiaDescargaController(application);
export const guiaDescargaRoutes = new GuiaDescargaRoutes(controller).router;

