import express from 'express';
import { GuiaDespachoController } from './guiadespacho.controller';
import { GuiaDespachoApplication } from '../../applications/guiadespacho';
import { GuiaDespachoAdapter } from '../../adapters/guiadespacho';
import { IGuiaDespachoPort } from '../../ports/guiadespacho';

export class GuiaDespachoRoutes {

  readonly router = express.Router()

  constructor(private readonly controller: GuiaDespachoController){
    this.mountRotes();
  }

  mountRotes(){
    this.router.post('/add', this.controller.addGuia.bind(this.controller));
  }
}

const port: IGuiaDespachoPort = new GuiaDespachoAdapter();
const application = new GuiaDespachoApplication(port);
const controller = new GuiaDespachoController(application);
export const guiaDespachoRoutes = new GuiaDespachoRoutes(controller).router;