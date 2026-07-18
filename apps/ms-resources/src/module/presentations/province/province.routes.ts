import express from 'express';
import { ProvinceController } from './province.controller';
import { ProvinceApplication } from '../../applications/province';
import { ProvinceAdapter } from '../../adapters/province';
import { IProvincePort } from '../../ports/province';

class ProvinceRoutes {
    readonly router = express.Router();

    constructor(private readonly controller: ProvinceController) {
        this.mountRoutes();
    }

    private mountRoutes() {
        this.router.get('/', this.controller.findByAll.bind(this.controller));
    }
}

const port: IProvincePort = new ProvinceAdapter();
const application = new ProvinceApplication(port);
const controller = new ProvinceController(application);
export const provinceRoutes = new ProvinceRoutes(controller).router;