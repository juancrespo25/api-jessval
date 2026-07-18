import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IDespachoPort } from '../../ports/despacho';
import { Despacho } from '../../applications/despacho';
import { DespachoEntity } from './entities';
import { Repository } from 'typeorm';

export class DespachoAdapter implements IDespachoPort {
  private repository: Repository<DespachoEntity> | null = null;

  getRepository(): Repository<DespachoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(DespachoEntity);
    }
    return this.repository;
  }

  async findById(id: number): Promise<Despacho | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const despachoEntity = await this.getRepository().findOne({ where: { id } });
    if (!despachoEntity) {
      return null;
    }

    return new Despacho({
      id: despachoEntity.id,
      fecha_creacion: despachoEntity.fecha_creacion,
      agente: despachoEntity.agente,
      tipoenvio: despachoEntity.tipoenvio,
      empresatransporte: despachoEntity.empresatransporte,
      estado: despachoEntity.estado,
      status: despachoEntity.status
    });
  }

  async findAll(fecha_inicial: Date, fecha_final: Date, agente: number, estado: string): Promise<Despacho[] | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const despachoEntity = await this.getRepository()
      .createQueryBuilder('despacho')

      .where('despacho.fecha_creacion BETWEEN :fecha_inicial AND :fecha_final', { fecha_inicial, fecha_final })
      .andWhere('despacho.agente = :agente', { agente })
      .andWhere('despacho.estado = :estado', { estado })
      .getMany();

    if (!despachoEntity || despachoEntity.length === 0) {
      return [];
    }

    return despachoEntity.map(
      (entity) =>
        new Despacho({
          id: entity.id,
          fecha_creacion: entity.fecha_creacion,
          agente: entity.agente,
          tipoenvio: entity.tipoenvio,
          empresatransporte: entity.empresatransporte,
          estado: entity.estado,
          status: entity.status
        }),
    );
  }

  async save(despacho: Despacho): Promise<Despacho> {
    const { id, fecha_creacion, agente, tipoenvio, empresatransporte, estado, status } = despacho.Properties;
    const despachoEntity = new DespachoEntity();
    Object.assign(despachoEntity, {
      id,
      fecha_creacion,
      agente,
      tipoenvio,
      empresatransporte,
      estado,
      status
    });

    const saved = await this.getRepository().save(despachoEntity);

    return new Despacho({
      id: saved.id,
      fecha_creacion: saved.fecha_creacion,
      agente: saved.agente,
      tipoenvio: saved.tipoenvio,
      empresatransporte: saved.empresatransporte,
      estado: saved.estado,
      status: saved.status
    });
  }
}