import { DataSource } from 'typeorm';

export type ReturnType = string | NodeJS.ErrnoException | DataSource | boolean

export abstract class Bootstrapp {
    abstract initialize(): Promise<ReturnType>;
}