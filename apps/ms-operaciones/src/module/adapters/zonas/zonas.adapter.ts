import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IZonasPort } from '../../ports/zonas';
import { Zonas } from '../../applications/zonas';
import { ZonasEntity } from './entities';
import { Repository } from 'typeorm';

export class ZonasAdapter implements IZonasPort {

  private repository: Repository<ZonasEntity> | null = null;

  private getRepository(): Repository<ZonasEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(ZonasEntity);
    }
    return this.repository;
  }

  async findAll(estado: boolean): Promise<Zonas[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const zonasEntity = await this.getRepository().find({ where: { estado } });
    if (!zonasEntity || zonasEntity.length === 0) {
      return [];
    }
    return zonasEntity.map(
      (entity) =>
        new Zonas({
          id: entity.id,
          codigo: entity.codigo,
          descripcion: entity.descripcion,
          estado: entity.estado,
        }),
    );
  }

  async save(zonas: Zonas): Promise<Zonas> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const zonasEntity = new ZonasEntity();
    zonasEntity.codigo = zonas.properties().codigo;
    zonasEntity.descripcion = zonas.properties().descripcion;
    zonasEntity.estado = zonas.properties().estado;

    const savedZonas = await this.getRepository().save(zonasEntity);

    return new Zonas({
      id: savedZonas.id,
      codigo: savedZonas.codigo,
      descripcion: savedZonas.descripcion,
      estado: savedZonas.estado,
    });
  }

}