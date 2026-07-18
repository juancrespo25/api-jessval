import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IAgentePort } from '../../ports/agentes';
import { Agente } from '../../applications/agentes';
import { AgenteEntity } from './entities';
import { Repository } from 'typeorm';

export class AgenteAdapter implements IAgentePort {
  private repository: Repository<AgenteEntity> | null = null;

  getRepository(): Repository<AgenteEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(AgenteEntity);
    }
    return this.repository;
  }

  async findAllStatus(status?: boolean): Promise<Agente[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const agenteEntity = await this.getRepository()
      .createQueryBuilder('agente')
      .select('agente.descripcion', 'descripcion')
      .addSelect('agente.id', 'id')
      .innerJoin('provincia', 'p', 'agente.provincia = p.codigo')
      .addSelect('p.descripcion', 'provincia')
      .where('agente.estado = :status', { status })
      .getRawMany();

    if (!agenteEntity || agenteEntity.length === 0) {
      return [];
    }

    return agenteEntity.map(
      (entity) =>
        new Agente({
          id: entity.id,
          provincia_agente: entity.provincia + ' - ' + entity.descripcion,
          estado: entity.estado,
        }),
    );
  }

  async save(agente: Agente): Promise<Agente> {
    const { id, provincia, descripcion, direccion, ubigeo, telefono, representante } =
      agente.properties;
    const agenteEntity = new AgenteEntity();
    Object.assign(agenteEntity, {
      id,
      provincia,
      descripcion,
      direccion,
      ubigeo,
      telefono,
      representante,
      estado: true,
    });

    const saved = await this.getRepository().save(agenteEntity);

    return new Agente({
      id: saved.id,
      provincia: saved.provincia,
      descripcion: saved.descripcion,
      direccion: saved.direccion,
      ubigeo: saved.ubigeo,
      telefono: saved.telefono,
      representante: saved.representante,
      estado: saved.estado,
    });
  }
}
