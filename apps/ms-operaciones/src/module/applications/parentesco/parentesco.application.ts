import { IParentescoPort } from '../../ports/parentesco';
import { Parentesco } from './parentesco';

export class ParentescoApplication implements IParentescoPort {
  constructor(private readonly parentescoPort: IParentescoPort) {}
  async findAll(estado?: boolean): Promise<Parentesco[]> {
    return await this.parentescoPort.findAll(estado);
  }

  async save(parentesco: Parentesco): Promise<Parentesco> {
    return await this.parentescoPort.save(parentesco);
  }
}
