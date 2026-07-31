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

    const { entities, raw } = await this.getRepository()
      .createQueryBuilder('despacho')
      .leftJoinAndSelect('despacho.guias', 'guias')
      .innerJoin('agente', 'a', 'despacho.agente=a.id')
      .addSelect('a.descripcion', 'agente_name')
      .innerJoin('provincia', 'p', 'a.provincia=p.codigo')
      .addSelect('p.descripcion', 'provincia_name')
      .innerJoin('empresa_transporte', 'e', 'despacho.empresatransporte=e.id')
      .addSelect('e.descripcion', 'etransporte')
      .innerJoin('tipoenvio', 't', 'despacho.tipoenvio=t.id')
      .addSelect('t.descripcion', 'tenvio')
      .where('despacho.id= :id', { id })
      .getRawAndEntities();

    if (!entities.length) return null;

    const despachoEntity = entities[0];

    const agente_name: string | undefined = raw[0]?.agente_name ?? undefined;
    const provincia_name: string | undefined = raw[0]?.provincia_name ?? undefined;
    const etransporte: string | undefined = raw[0]?.etransporte ?? undefined;
    const tenvio: string | undefined = raw[0]?.tenvio ?? undefined;

    return new Despacho({
      id: despachoEntity.id,
      agente_name: agente_name,
      provincia: provincia_name,
      empresatransporte: etransporte,
      tenvio_name: tenvio,
      guias:
        despachoEntity.guias?.map((guia) => ({
          id: guia.id,
          despacho: guia.despacho?.id,
          id_guia: guia.id_guia,
          estado: guia.estado,
          userCreated: guia.userCreated,
          createdAt: guia.createdAt,
        })) ?? [],
    });
  }

  async findAll(
    fecha_inicial: Date,
    fecha_final: Date,
    agente: number,
    estado: string,
  ): Promise<Despacho[] | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const query = this.getRepository()
      .createQueryBuilder('despacho')
      .select(
        'despacho.id id, despacho.fecha_creacion fecha_creacion, despacho.fecha_creacion fecha_creacion,  despacho.estado estado',
      )
      .innerJoin('agente', 'a', 'despacho.agente=a.id')
      .addSelect('a.descripcion', 'agente_name')
      .innerJoin('provincia', 'p', 'a.provincia=p.codigo')
      .addSelect('p.descripcion', 'provincia_name')
      .innerJoin('empresa_transporte', 'e', 'despacho.empresatransporte=e.id')
      .addSelect('e.descripcion', 'etransporte')
      .innerJoin('tipoenvio', 't', 'despacho.tipoenvio=t.id')
      .addSelect('t.descripcion', 'tenvio')
      .where('despacho.fecha_creacion BETWEEN :fecha_inicial AND :fecha_final', {
        fecha_inicial,
        fecha_final,
      });
    if (agente !== 0) {
      query.andWhere('despacho.agente = :agente', { agente });
    }

    if (estado !== '') {
      query.andWhere('despacho.estado = :estado', { estado });
    }

    const despachoEntity = await query.getRawMany();

    if (!despachoEntity || despachoEntity.length === 0) {
      return [];
    }

    return despachoEntity.map(
      (entity) =>
        new Despacho({
          id: entity.id,
          agente_name: entity.agente_name,
          provincia: entity.provincia_name,
          empresatransporte: entity.etransporte,
          tenvio_name: entity.tenvio,
          fecha_creacion: entity.fecha_creacion,
          estado: entity.estado,
        }),
    );
  }

  async save(despacho: Despacho): Promise<Despacho> {
    const {
      id,
      fecha_creacion,
      agente,
      tipoenvio,
      empresatransporte,
      estado,
      status,
      userCreated,
    } = despacho.Properties;
    const despachoEntity = new DespachoEntity();
    Object.assign(despachoEntity, {
      id,
      fecha_creacion,
      agente,
      tipoenvio,
      empresatransporte,
      estado,
      status,
      userCreated,
    });

    const saved = await this.getRepository().save(despachoEntity);

    return new Despacho({
      id: saved.id,
      fecha_creacion: saved.fecha_creacion,
      agente: saved.agente,
      tipoenvio: saved.tipoenvio,
      empresatransporte: saved.empresatransporte,
      estado: saved.estado,
      status: saved.status,
    });
  }
}
