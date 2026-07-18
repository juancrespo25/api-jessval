import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IContenidoPort } from '../../ports/contenido';
import { Contenido } from '../../applications/contenido';
import { ContenidoEntity } from './entities';
import { Repository } from 'typeorm';

export class ContenidoAdapter implements IContenidoPort {
  private repository: Repository<ContenidoEntity> | null = null;

  getRepository(): Repository<ContenidoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(ContenidoEntity);
    }
    return this.repository;
  }

  async findAll(status?: boolean): Promise<Contenido[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const contenidoEntity = await this.getRepository().findBy({ estado: status });
    if (!contenidoEntity || contenidoEntity.length === 0) {
      return [];
    }
    return contenidoEntity.map(
      (entity) =>
        new Contenido({
          id: entity.id,
          descripcion: entity.descripcion,
          estado: entity.estado,
        }),
    );
  }

  async save(contenido: Contenido): Promise<Contenido> {
    const { id, descripcion } = contenido.properties;

    const contenidoEntity = new ContenidoEntity();
    Object.assign(contenidoEntity, {
      id,
      descripcion,
      estado: true,
    });

    const saved = await this.getRepository().save(contenidoEntity);

    return new Contenido({
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
    });
  }

  async update(contenido: Contenido): Promise<Contenido | null> {
    const { id, estado } = contenido.properties;

    const result = await this.getRepository().findOne({ where: { id } });
    if (!result) return null;

    result.estado = estado;
    const updated = await this.getRepository().save(result);

    return new Contenido({
      id: updated.id,
      descripcion: updated.descripcion,
      estado: updated.estado,
    });
  }
}
