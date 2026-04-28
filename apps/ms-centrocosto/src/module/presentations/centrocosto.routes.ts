import express from 'express';
import { CentroCostoController } from './centrocosto.controller';
import { CentroCostoApplication } from '../applications';
import { CentroCostoAdapter } from '../adapters';
import { ICentroCostoPort } from '../ports';

class CentroCostoRoutes {

    readonly router = express.Router();

    constructor(private readonly controller: CentroCostoController){
        this.mountRoutes();
    }

    private mountRoutes(){
        this.router.post('/', this.controller.create.bind(this.controller));
        this.router.get('/', this.controller.findAll.bind(this.controller));
        this.router.get('/:code', this.controller.findById.bind(this.controller));
        this.router.delete('/', this.controller.delete.bind(this.controller));
        this.router.patch('/', this.controller.update.bind(this.controller));
        //this.router.get('/name/:name', this.controller.findByName.bind(this.controller));
    }
}

const port: ICentroCostoPort = new CentroCostoAdapter();
const application = new CentroCostoApplication(port);
const controller = new CentroCostoController(application);
export const centroCostoRoutes = new CentroCostoRoutes(controller).router;