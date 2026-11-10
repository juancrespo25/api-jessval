import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IDespachoPort } from '../../ports/despacho';
import { Despacho } from '../../applications/despacho';
import { DespachoEntity } from './entities';
import { Repository } from 'typeorm';
import { GuiaDespachoEntity } from '../guiadespacho/entities';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';
import { GuiaEntity } from '../guia/entities';
import { AgenteEntity } from '../agentes/entities';

export class DespachoAdapter implements IDespachoPort {
  private repository: Repository<DespachoEntity> | null = null;
  private repositoryAgente: Repository<AgenteEntity> | null = null;

  getRepository(): Repository<DespachoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(DespachoEntity);
    }
    return this.repository;
  }

  getRepositoryEntity(): Repository<AgenteEntity> {
    if (!this.repositoryAgente) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repositoryAgente = DataBaseBootstrapp.dataSource.getRepository(AgenteEntity);
    }
    return this.repositoryAgente;
  }

  async confirmDespacho(id: number, status: string, userUpdated: string): Promise<Despacho> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const updateDespacho = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const despachoEntity = await this.getRepository().findOne({ where: { id } });

      if (!despachoEntity) {
        throw new Error(`Despacho with id ${id} not found`);
      }

      Object.assign(despachoEntity, {
        estado: status,
        userAdmit: userUpdated,
        admittedAt: new Date(),
      });

      const updateEntity = await this.getRepository().update({ id }, despachoEntity);

      if (updateEntity.affected === 0) {
        throw new Error(`Failed to confirm despacho with id ${id}`);
      } else {
        const guiaDespachoEntities = await manager.find(GuiaDespachoEntity, {
          where: { despacho: { id } },
        });
        for (const guiaDespacho of guiaDespachoEntities) {
          //actualizando guias
          await manager.update(
            GuiaEntity,
            { id_guia: guiaDespacho.id_guia },
            {
              estado: 'ET',
              userUpdated: userUpdated,
              updatedAt: new Date(),
            },
          );

          //actualizando la tabla guiadespacho
          await manager.update(
            GuiaDespachoEntity,
            { id_guia: guiaDespacho.id_guia },
            {
              estado: 'ET',
            },
          );

          //registrando movimiento
          const movimientoEntity = new MovimientoEntity();
          Object.assign(movimientoEntity, {
            id_guia: guiaDespacho.id_guia,
            modulo: 'DESPACHO',
            detalle: 'ENVIO EN TRANSITO',
            userCreated: userUpdated,
          });
          await manager.save(MovimientoEntity, movimientoEntity);
        }
      }

      return updateEntity;
    });

    return new Despacho({
      id,
      estado: status,
      userUpdated,
    });
  }

  async updateDespachoStatus(id: number, status: string, userUpdated: string): Promise<Despacho> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const despachoEntity = await this.getRepository().findOne({ where: { id } });

    if (!despachoEntity) return null;

    Object.assign(despachoEntity, {
      estado: status,
      userUpdated,
      updatedAt: new Date(),
    });

    const updateEntity = await this.getRepository().update({ id }, despachoEntity);

    if (updateEntity.affected === 0) {
      throw new Error(`Failed to update despacho with id ${id}`);
    }

    return new Despacho({
      id: despachoEntity.id,
      estado: status,
      userUpdated,
    });
  }

  async updateDespacho(despacho: Despacho): Promise<Despacho> {
    const { id, userUpdated, estado, guias = [] } = despacho.Properties;

    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const updateDespachoGuia = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const despachoEntity = new DespachoEntity();
      Object.assign(despachoEntity, {
        id,
        userUpdated,
        estado,
        updatedAt: new Date(),
      });

      const updated = await manager.update(DespachoEntity, { id }, despachoEntity);

      const guiaDespachoEntities = await Promise.all(
        guias.map(async (guia) => {
          const guiaDespachoEntity = new GuiaDespachoEntity();

          Object.assign(guiaDespachoEntity, {
            despacho: despachoEntity.id,
            id_guia: guia.id_guia,
            estado: guia.estado,
            userCreated: guia.userCreated,
            createdAt: new Date(),
          });

          const updateGuia = await manager.update(
            GuiaEntity,
            { id_guia: guia.id_guia },
            {
              estado: guia.estado,
              userUpdated,
              updatedAt: new Date(),
            },
          );

          const movimientoEntity = new MovimientoEntity();

          Object.assign(movimientoEntity, {
            id_guia: guia.id_guia,
            modulo: 'DESPACHO',
            detalle: 'DESPACHADO',
            userCreated: userUpdated,
          });

          const createMovimiento = await manager.save(MovimientoEntity, movimientoEntity);
          return guiaDespachoEntity;
        }),
      );

      if (guiaDespachoEntities.length > 0) {
        await manager.save(GuiaDespachoEntity, guiaDespachoEntities);
      }

      return updated;
    });

    return new Despacho({
      id,
      userUpdated,
      estado,
      guias,
    });
  }

  async findById(id: number): Promise<Despacho | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const rows = await this.getRepository()
      .createQueryBuilder('despacho')
      .leftJoin('despacho.guias', 'guias')
      .leftJoin('guia', 'g', 'guias.id_guia = g.id_guia')
      .leftJoin('ubigeo', 'u', 'g.destino = u.codigo')
      .leftJoin('destinatario', 'd', 'g.destinatario = d.id')
      .innerJoin('agente', 'a', 'despacho.agente=a.id')
      .addSelect('despacho.id', 'despacho_id')
      .addSelect('despacho.agente', 'despacho_agente')
      .addSelect('despacho.tipoenvio', 'despacho_tipoenvio')
      .addSelect('despacho.empresatransporte', 'despacho_empresatransporte')
      .addSelect('despacho.estado', 'despacho_estado')
      .addSelect('despacho.status', 'despacho_status')
      .addSelect('despacho.fecha_creacion', 'despacho_fecha_creacion')
      .addSelect('a.descripcion', 'agente_name')
      .innerJoin('provincia', 'p', 'a.provincia=p.codigo')
      .addSelect('p.descripcion', 'provincia_name')
      .addSelect('p.codigo', 'prov_code')
      .innerJoin('empresa_transporte', 'e', 'despacho.empresatransporte=e.id')
      .addSelect('e.descripcion', 'etransporte')
      .innerJoin('tipoenvio', 't', 'despacho.tipoenvio=t.id')
      .addSelect('t.descripcion', 'tenvio')
      .addSelect('guias.id', 'guia_id')
      .addSelect('guias.id_guia', 'guia_id_guia')
      .addSelect('guias.estado', 'guia_estado')
      .addSelect('guias.userCreated', 'guia_userCreated')
      .addSelect('guias.createdAt', 'guia_createdAt')
      .addSelect('u.codprovincia', 'provincia')
      .addSelect("CONCAT(u.distrito, ' - ', u.provincia)", 'destino')
      .addSelect('d.nombres', 'dnombres')
      .where('despacho.id = :id', { id })
      .getRawMany();

    if (!rows.length) return null;

    const despachoRow = rows[0];
    const guias = rows
      .filter((row) => row.guia_id !== null)
      .map((row) => ({
        id_guia: row.guia_id_guia,
        estado: row.guia_estado,
        provincia: row.provincia,
        destino: row.destino,
        dnombres: row.dnombres,
      }));

    return new Despacho({
      id: despachoRow.despacho_id,
      empresatransporte: despachoRow.etransporte,
      estado: despachoRow.despacho_estado,
      status: despachoRow.despacho_status,
      fecha_creacion: despachoRow.despacho_fecha_creacion,
      agente_name: despachoRow.agente_name,
      provincia: despachoRow.provincia_name,
      provincia_code: despachoRow.prov_code,
      tenvio_name: despachoRow.tenvio,
      guias,
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
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const {
      id,
      fecha_creacion,
      agente,
      tipoenvio,
      empresatransporte,
      estado,
      status,
      tipo,
      userCreated,
    } = despacho.Properties;

    //inicia la transaccion
    const despachoSave = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
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

      //grabando el despacho
      const saved = await manager.save(DespachoEntity, despachoEntity);

      if (saved && tipo === 1) {
        //busco las guías que corresponden a la provincia del agente
        const estado ='PD';
        const rows = await this.getRepositoryEntity()
          .createQueryBuilder('agente')
          .innerJoin('ubigeo', 'u', 'agente.provincia = u.codprovincia')
          .innerJoin('guia', 'g', 'u.codigo = g.destino')
          .select('g.id_guia', 'id_guia')
          .where('agente.id = :agente', { agente })
          .andWhere('g.estado = :estado', { estado })
          .getRawMany();

        if (rows.length > 0) {
          const guiaDespachoEntities: GuiaDespachoEntity[] = [];

          for (const row of rows) {
            if (row.id_guia === null || row.id_guia === undefined) {
              continue;
            }

            await manager.update(
              GuiaEntity,
              { id_guia: Number(row.id_guia) },
              {
                estado: 'DP',
                userUpdated: userCreated,
                updatedAt: new Date(),
              },
            );

            const guiaDespachoEntity = new GuiaDespachoEntity();
            Object.assign(guiaDespachoEntity, {
              despacho: { id: saved.id },
              id_guia: Number(row.id_guia),
              estado: 'DP',
              userCreated: userCreated ?? 'SYSTEM',
              createdAt: new Date(),
            });

            guiaDespachoEntities.push(guiaDespachoEntity);

            const movimientoEntity = new MovimientoEntity();

            Object.assign(movimientoEntity, {
              id_guia: row.id_guia,
              modulo: 'DESPACHO',
              detalle: 'DESPACHADO',
              userCreated,
            });

            await manager.save(MovimientoEntity, movimientoEntity);
          }

          if (guiaDespachoEntities.length > 0) {
            await manager.save(GuiaDespachoEntity, guiaDespachoEntities);
          }
        }
      }

      return saved;
    });

    return new Despacho({
      id: despachoSave.id,
      fecha_creacion: despachoSave.fecha_creacion,
      agente: despachoSave.agente,
      tipoenvio: despachoSave.tipoenvio,
      empresatransporte: despachoSave.empresatransporte,
      estado: despachoSave.estado,
      status: despachoSave.status,
    });
  }

  async generarDespachos(): Promise<true> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      await manager.query('CALL generar_despachos()');
    });

    return true;
  }
}
