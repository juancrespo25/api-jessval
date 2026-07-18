import { Customer } from '../applications';

export interface ICustomerPort {
    create(customer: Customer): Promise<Customer>;
    findAll(status?: boolean): Promise<Customer[]>;
    findById(code: string): Promise<Customer | null>;
    findByName(name: string): Promise<Customer[]>;
    update(customer: Customer): Promise<Customer>;
    findRuc(ruc: string): Promise<boolean>;
    delete(code: string, userUpdate: string): Promise<boolean>;
}