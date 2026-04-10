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

    async update(customer: Customer): Promise<Customer> {
        return await this.customerPort.update(customer);
    }

    async delete(code: string, userUpdate: string): Promise<boolean> {
        return this.customerPort.delete(code, userUpdate);
    }
}