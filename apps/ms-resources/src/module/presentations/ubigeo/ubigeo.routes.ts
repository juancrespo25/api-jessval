import express from 'express';
import { UbigeoController } from './ubigeo.controller';
import { UbigeoApplication } from '../../applications/ubigeo';
import { UbigeoAdapter } from '../../adapters/ubigeo';
import { IUbigeoPort } from '../../ports/ubigeo';

class UbigeoRoutes {
    readonly router = express.Router();

    constructor(private readonly controller: UbigeoController) {
        this.mountRoutes();
    }

    private mountRoutes() {
        this.router.get('/name/:name', this.controller.findByName.bind(this.controller));
        this.router.get('/code/:code', this.controller.findByCode.bind(this.controller));
    }
}

const port: IUbigeoPort = new UbigeoAdapter();
const application = new UbigeoApplication(port);
const controller = new UbigeoController(application);
export const ubigeoRoutes = new UbigeoRoutes(controller).router;