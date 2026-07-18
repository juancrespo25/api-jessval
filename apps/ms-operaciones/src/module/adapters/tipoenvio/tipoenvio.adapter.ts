import { DataBaseBootstrapp } from '../../../bootstrapp';
import { ITipoEnvioPort } from '../../ports/tipoenvio';
import { TipoEnvio } from '../../applications/tipoenvio';
import { TipoEnvioEntity } from './entities';
import { Repository } from 'typeorm';

export class TipoEnvioAdapter implements ITipoEnvioPort {
  private repository: Repository<TipoEnvioEntity> | null = null;

  getRepository(): Repository<TipoEnvioEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(TipoEnvioEntity);
    }
    return this.repository;
  }

  async findAll(estado?: boolean, linea?: number): Promise<TipoEnvio[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const tipoEnvioEntity = await this.getRepository().findBy({ estado, linea });
    if (!tipoEnvioEntity || tipoEnvioEntity.length === 0) {
      return [];
    }
    return tipoEnvioEntity.map(
      (entity) =>
        new TipoEnvio({
          id: entity.id,
          descripcion: entity.descripcion,
          linea: entity.linea,
          estado: entity.estado,
        }),
    );
  }

  async save(tipoEnvio: TipoEnvio): Promise<TipoEnvio> {
    const { id, descripcion, linea } = tipoEnvio.properties;

    const tipoEnvioEntity = new TipoEnvioEntity();
    Object.assign(tipoEnvioEntity, {
      id,
      descripcion,
      linea,
      estado: true,
    });

    const saved = await this.getRepository().save(tipoEnvioEntity);

    return new TipoEnvio({
      id: saved.id,
      descripcion: saved.descripcion,
      linea: saved.linea,
      estado: saved.estado,
    });
  }
}
