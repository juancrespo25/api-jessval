import express from 'express';
import { OrdenController } from './orden.controller';
import { OrdenApplication } from '../../applications/orden';
import { OrdenAdapter } from '../../adapters/orden';
import { IOrdenPort } from '../../ports/orden';

class OrdenRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: OrdenController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get('/query', this.controller.queryOrden.bind(this.controller));
    this.router.get('/:numero/guias/impresion', this.controller.getGuiasImpresion.bind(this.controller));
    this.router.get('/:numero/guias/etiquetas-barra', this.controller.getEtiquetasBarraImpresion.bind(this.controller));
    this.router.get('/:numero/detalle', this.controller.getOrdenByCode.bind(this.controller));
    this.router.get('/:numero', this.controller.findById.bind(this.controller));
    this.router.post('/', this.controller.create.bind(this.controller));
    this.router.get('/get/today', this.controller.getToday.bind(this.controller));
  }
}

const port: IOrdenPort = new OrdenAdapter();
const application = new OrdenApplication(port);
const controller = new OrdenController(application);
export const ordenRoutes = new OrdenRoutes(controller).router;
