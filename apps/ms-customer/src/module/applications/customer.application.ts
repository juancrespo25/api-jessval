import { ICustomerPort } from '../ports';
import { Customer } from './customer';

export class CustomerApplication {
    constructor(private readonly customerPort: ICustomerPort) {}

    async create(customer: Customer): Promise<Customer> {
        return await this.customerPort.create(customer);
    }

    async findAll(status?: boolean): Promise<Customer[]> {
        return await this.customerPort.findAll(status);
    }

    async findById(code: string): Promise<Customer | null> {
        return await this.customerPort.findById(code);
    }

    async findByName(name: string): Promise<Customer[]> {
        return await this.customerPort.findByName(name);
    }

    async update(customer: Customer): Promise<Customer> {
        return await this.customerPort.update(customer);
    }

    async findRuc(ruc: string): Promise<boolean>{
        return await this.customerPort.findRuc(ruc);
    }
    async delete(code: string, userUpdate: string): Promise<boolean> {
        return this.customerPort.delete(code, userUpdate);
    }
}