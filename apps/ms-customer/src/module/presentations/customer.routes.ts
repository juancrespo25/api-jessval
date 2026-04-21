import express from 'express';
import { CustomerController } from './customer.controller';
import { CustomerApplication } from '../applications';
import { CustomerAdapter } from '../adapters';
import { ICustomerPort } from '../ports';

class CustomerRoutes {
    readonly router = express.Router();

    constructor(private readonly controller: CustomerController) {
        this.mountRoutes();
    }

    private mountRoutes() {
        this.router.post('/', this.controller.create.bind(this.controller));
        this.router.get('/', this.controller.findAll.bind(this.controller));
        this.router.get('/:code', this.controller.findById.bind(this.controller));
        this.router.delete('/', this.controller.delete.bind(this.controller));
        this.router.put('/', this.controller.update.bind(this.controller));
    }
}

const port: ICustomerPort = new CustomerAdapter();
const application = new CustomerApplication(port);
const controller = new CustomerController(application);
export const customerRoutes = new CustomerRoutes(controller).router;