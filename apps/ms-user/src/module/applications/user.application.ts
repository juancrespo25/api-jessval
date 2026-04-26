 import { IUserPort } from '../ports/user.port';
import { User } from './user';

export class UserApplication {
    
    constructor(private readonly repository: IUserPort) {}

    async create(user: User): Promise<User> {
        return await this.repository.create(user);
    }

    async findAll(status?: boolean): Promise<User[]> {
        return await this.repository.findAll(status);
    }

    async findById(id: string): Promise<User> {
        return await this.repository.findById(id);
    }

    async findByUsername(username: string): Promise<User> {
        return await this.repository.findByUsername(username);
    }

    async findByName(name: string): Promise<User[]> {
        return await this.repository.findByName(name);
    }

    async update(user: User): Promise<User> {
        return await this.repository.update(user);
    }

    async delete(id: string, userUpdate: string): Promise<boolean> {
        return await this.repository.delete(id, userUpdate);
    }
}