import { DataBaseBootstrapp } from '../../../bootstrapp';
import { ILineaPort } from '../../ports/linea';
import { Linea } from '../../applications/linea';
import { LineaEntity } from './entities';
import { Repository } from 'typeorm';

export class LineaAdapter implements ILineaPort {
  private repository: Repository<LineaEntity> | null = null;

  getRepository(): Repository<LineaEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(LineaEntity);
    }
    return this.repository;
  }

  async findAll(estado?: boolean): Promise<Linea[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const lineaEntity = await this.getRepository().findBy({ estado });
    if (!lineaEntity || lineaEntity.length === 0) {
      return [];
    }
    return lineaEntity.map(
      (entity) =>
        new Linea({
          id: entity.id,
          descripcion: entity.descripcion,
          estado: entity.estado,
        }),
    );
  }

  async save(linea: Linea): Promise<Linea> {
    const { id, descripcion } = linea.properties;

    const lineaEntity = new LineaEntity();
    Object.assign(lineaEntity, {
      id,
      descripcion,
      estado: true,
    });

    const saved = await this.getRepository().save(lineaEntity);

    return new Linea({
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
    });
  }
}
