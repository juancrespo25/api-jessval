import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IParentescoPort } from '../../ports/parentesco';
import { Parentesco } from '../../applications/parentesco';
import { ParentescoEntity } from './entities';
import { Repository } from 'typeorm';

export class ParentescoAdapter implements IParentescoPort {
  private repository: Repository<ParentescoEntity> | null = null;

  private getRepository(): Repository<ParentescoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(ParentescoEntity);
    }
    return this.repository;
  }

  async findAll(estado?: boolean): Promise<Parentesco[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const parentescoEntity = await this.getRepository().findBy({ estado });
    if (!parentescoEntity || parentescoEntity.length === 0) {
      return [];
    }
    return parentescoEntity.map(
      (entity) =>
        new Parentesco({
          id: entity.id,
          descripcion: entity.descripcion,
          estado: entity.estado,
        }),
    );
  }

  async save(parentesco: Parentesco): Promise<Parentesco> {
    const { id, descripcion } = parentesco.properties;
    const parentescoEntity = new ParentescoEntity();
    Object.assign(parentescoEntity, { id, descripcion, estado: true });
    const saved = await this.getRepository().save(parentescoEntity);
    return new Parentesco({
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
    });
  }
}
