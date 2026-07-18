import { User } from '../applications';

export interface IUserPort {
    create(user: User): Promise<User>;
    findAll(status?: boolean): Promise<User[]>;
    findById(code: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByName(name: string): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(code: string, userUpdate: string): Promise<boolean>;
    findUserType(userType: string): Promise<User[]>;
}