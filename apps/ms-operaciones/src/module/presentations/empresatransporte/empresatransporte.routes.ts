import express from 'express';
import { EmpresaTransporteController } from './empresatransporte.controller';
import { EmpresaTransporteApplication } from '../../applications/empresatransporte';
import { EmpresaTransporteAdapter } from '../../adapters/empresatransporte';
import { IEmpresaTransportePort } from '../../ports/empresatransporte';

export class EmpresaTransporteRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: EmpresaTransporteController) {

    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));
  }
}

const port: IEmpresaTransportePort = new EmpresaTransporteAdapter();
const application = new EmpresaTransporteApplication(port);
const controller = new EmpresaTransporteController(application);
export const empresaTransporteRoutes = new EmpresaTransporteRoutes(controller).router;