import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IMotivoPort } from '../../ports/motivos';
import { Motivo } from '../../applications/motivos';
import { MotivoEntity } from './entities';
import { Repository } from 'typeorm';

export class MotivoAdapter implements IMotivoPort {

  private repository: Repository<MotivoEntity> | null = null;

  getRepository(): Repository<MotivoEntity> {
      if (!this.repository) {
        if (!DataBaseBootstrapp.dataSource) {
          throw new Error('Database connection not initialized');
        }
        this.repository = DataBaseBootstrapp.dataSource.getRepository(MotivoEntity);
      }
      return this.repository;
    }

  async findAll(estado: boolean, tipo: number): Promise<Motivo[]> {

    const motivoEntity = await this.getRepository().findBy({ estado, tipo });
    if (!motivoEntity || motivoEntity.length === 0) {
      return [];
    }

    return motivoEntity.map(
      (entity) =>
        new Motivo({
          id: entity.id,
          descripcion: entity.descripcion,
          estado: entity.estado,
          tipo: entity.tipo,
        }),
    );
  }

  async save(motivo: Motivo): Promise<Motivo> {

    const motivoEntity = new MotivoEntity();
    Object.assign(motivoEntity, {
      ...motivo,
      estado: true,
    });

    const saved = await this.getRepository().save(motivoEntity);

    return new Motivo({
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
      tipo: saved.tipo
    });
  }


}