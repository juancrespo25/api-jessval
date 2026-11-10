import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IGuiaDescargaPort } from '../../ports/guiadescarga';
import { GuiaDescarga } from '../../applications/guiadescarga';
import { GuiaDescargaEntity } from './entities';
import { EntityManager, Repository } from 'typeorm';
import { GuiaEntity } from '../guia/entities';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';

const ESTADO_MOTIVADO = 'MT';
const MOVIMIENTO_MODULO = 'CONFIRMACIONES';
const MOVIMIENTO_DETALLE = {
  save: { motivado: 'CONFIRMACION DE MOTIVADO', entregado: 'CONFIRMACION DE ENTREGA' },
  update: { motivado: 'DESCARGA DE MOTIVO', entregado: 'DESCARGA DE ENTREGA' },
};

export class GuiaDescargaAdapter implements IGuiaDescargaPort {
  private guiaDescargaRepository: Repository<GuiaDescargaEntity> | null = null;

  private getGuiaDescargaRepository(): Repository<GuiaDescargaEntity> {
    if (!this.guiaDescargaRepository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.guiaDescargaRepository = DataBaseBootstrapp.dataSource.getRepository(GuiaDescargaEntity);
    }
    return this.guiaDescargaRepository;
  }

  // Actualiza la guía relacionada e inserta el movimiento dentro de la transacción recibida
  private async syncGuiaYMovimiento(
    manager: EntityManager,
    data: {
      idGuia: number;
      estado: string;
      fecha_descarga: string | null;
      hora_descarga: string | null;
      user?: string | null;
      detalle: { motivado: string; entregado: string };
    },
  ): Promise<void> {
    const guiaUpdate: Partial<GuiaEntity> = {
      estado: data.estado,
      fecha_descarga: data.fecha_descarga,
      hora_descarga: data.hora_descarga,
      userUpdated: data.user ?? undefined,
      updatedAt: new Date(),
    };
    const result = await manager.update(GuiaEntity, { id_guia: data.idGuia }, guiaUpdate);
    if (result.affected === 0) {
      throw new Error(`Guia with id_guia ${data.idGuia} not found`);
    }

    const movimientoEntity = new MovimientoEntity();
    Object.assign(movimientoEntity, {
      id_guia: data.idGuia,
      modulo: MOVIMIENTO_MODULO,
      detalle: data.estado === ESTADO_MOTIVADO ? data.detalle.motivado : data.detalle.entregado,
      userCreated: data.user,
    });
    await manager.save(MovimientoEntity, movimientoEntity);
  }

  async save(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }
    const savedGuiaDescarga = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const guiaDescargaEntity = this.getGuiaDescargaRepository().create({
        id_guia: guiaDescarga.properties().id_guia,
        estado: guiaDescarga.properties().estado,
        tipo: guiaDescarga.properties().tipo,
        recibido: guiaDescarga.properties().recibido,
        parentesco: guiaDescarga.properties().parentesco,
        documento: guiaDescarga.properties().documento,
        motivo: guiaDescarga.properties().motivo,
        puerta: guiaDescarga.properties().puerta,
        colorpuerta: guiaDescarga.properties().colorpuerta,
        suministro: guiaDescarga.properties().suministro,
        fecha_descarga: guiaDescarga.properties().fecha_descarga,
        hora_descarga: guiaDescarga.properties().hora_descarga,
        userCreated: guiaDescarga.properties().userCreated,
        createdAt: new Date(),
      });

      const savedGuiaDescargaEntity = await manager.save(GuiaDescargaEntity, guiaDescargaEntity);

      await this.syncGuiaYMovimiento(manager, {
        idGuia: savedGuiaDescargaEntity.id_guia,
        estado: savedGuiaDescargaEntity.estado,
        fecha_descarga: savedGuiaDescargaEntity.fecha_descarga,
        hora_descarga: savedGuiaDescargaEntity.hora_descarga,
        user: guiaDescarga.properties().userCreated,
        detalle: MOVIMIENTO_DETALLE.save,
      });

      return savedGuiaDescargaEntity;
    });

    return new GuiaDescarga({
      id: savedGuiaDescarga.id,
      id_guia: savedGuiaDescarga.id_guia,
      tipo: savedGuiaDescarga.tipo,
      recibido: savedGuiaDescarga.recibido,
      parentesco: savedGuiaDescarga.parentesco,
      documento: savedGuiaDescarga.documento,
      motivo: savedGuiaDescarga.motivo,
      puerta: savedGuiaDescarga.puerta,
      colorpuerta: savedGuiaDescarga.colorpuerta,
      suministro: savedGuiaDescarga.suministro,
      fecha_descarga: savedGuiaDescarga.fecha_descarga,
      hora_descarga: savedGuiaDescarga.hora_descarga,
      createdAt: savedGuiaDescarga.createdAt,
      userCreated: savedGuiaDescarga.userCreated,
    });
  }

  async getById(id_guia: number): Promise<GuiaDescarga> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guiaDescargaEntity = await this.getGuiaDescargaRepository().findOne({
      where: { id_guia },
    });

    if (!guiaDescargaEntity) {
      throw new Error(`GuiaDescarga with id_guia ${id_guia} not found`);
    }

    return new GuiaDescarga({
      id: guiaDescargaEntity.id,
      estado: guiaDescargaEntity.estado,
      id_guia: guiaDescargaEntity.id_guia,
      tipo: guiaDescargaEntity.tipo,
      recibido: guiaDescargaEntity.recibido,
      parentesco: guiaDescargaEntity.parentesco,
      documento: guiaDescargaEntity.documento,
      motivo: guiaDescargaEntity.motivo,
      puerta: guiaDescargaEntity.puerta,
      colorpuerta: guiaDescargaEntity.colorpuerta,
      suministro: guiaDescargaEntity.suministro,
      fecha_descarga: guiaDescargaEntity.fecha_descarga,
      hora_descarga: guiaDescargaEntity.hora_descarga
    });
  }

  async update(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const props = guiaDescarga.properties();
    const idGuia = props.id_guia;

    const updatedEntity = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      // Bloqueo pesimista para evitar lost updates entre actualizaciones concurrentes
      const guiaDescargaEntity = await manager.findOne(GuiaDescargaEntity, {
        where: { id_guia: idGuia },
        lock: { mode: 'pessimistic_write' },
      });

      if (!guiaDescargaEntity) {
        throw new Error(`GuiaDescarga with id_guia ${idGuia} not found`);
      }

      const fields: Partial<GuiaDescargaEntity> = {
        estado: props.estado,
        tipo: props.tipo,
        recibido: props.recibido,
        parentesco: props.parentesco,
        documento: props.documento,
        motivo: props.motivo,
        puerta: props.puerta,
        colorpuerta: props.colorpuerta,
        suministro: props.suministro,
        fecha_descarga: props.fecha_descarga,
        hora_descarga: props.hora_descarga,
      };
      const definedFields = Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined),
      ) as Partial<GuiaDescargaEntity>;
      Object.assign(guiaDescargaEntity, definedFields);

      const saved = await manager.save(GuiaDescargaEntity, guiaDescargaEntity);

      await this.syncGuiaYMovimiento(manager, {
        idGuia,
        estado: saved.estado,
        fecha_descarga: saved.fecha_descarga,
        hora_descarga: saved.hora_descarga,
        user: props.userCreated,
        detalle: MOVIMIENTO_DETALLE.update,
      });

      return saved;
    });

    return new GuiaDescarga({
      id: updatedEntity.id,
      id_guia: updatedEntity.id_guia,
      estado: updatedEntity.estado,
      tipo: updatedEntity.tipo,
      recibido: updatedEntity.recibido,
      parentesco: updatedEntity.parentesco,
      documento: updatedEntity.documento,
      motivo: updatedEntity.motivo,
      puerta: updatedEntity.puerta,
      colorpuerta: updatedEntity.colorpuerta,
      suministro: updatedEntity.suministro,
      fecha_descarga: updatedEntity.fecha_descarga,
      hora_descarga: updatedEntity.hora_descarga,
    });
  }


  async getAllType(type: string): Promise<GuiaDescarga[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    // Los joins son contra tablas sin entidad en este servicio, por eso se usa getRawMany
    const rows = await this.getGuiaDescargaRepository()
      .createQueryBuilder('gd')
      .select([
        'gd.id AS id',
        'gd.id_guia AS id_guia',
        'gd.estado AS estado',
        'gd.tipo AS tipo',
        'gd.recibido AS recibido',
        'gd.parentesco AS parentesco',
        'gd.documento AS documento',
        'gd.motivo AS motivo',
        'gd.puerta AS puerta',
        'gd.colorpuerta AS colorpuerta',
        'gd.suministro AS suministro',
        'gd.fecha_descarga AS fecha_descarga',
        'gd.hora_descarga AS hora_descarga',
        'g.item AS item',
        'g.estado AS guia_estado',
        'o.numero AS orden',
        'c.descripcion AS cliente',
        'cc.descripcion AS centrocosto',
      ])
      .addSelect("CONCAT(u.distrito, ' - ', u.provincia)", 'destino')
      .addSelect("CONCAT(uu.nombres, ' - ', uu.apellidos)", 'usuario')
      .innerJoin('guia', 'g', 'gd.id_guia = g.id_guia')
      .innerJoin('orden', 'o', 'g.orden_id = o.id')
      .innerJoin('customer', 'c', 'o.customer = c.codigo')
      .innerJoin('centrocosto', 'cc', 'o.ccosto = cc.codigo')
      .innerJoin('ubigeo', 'u', 'g.destino = u.codigo')
      .innerJoin('user', 'uu', 'uu.codigo = gd."userCreated"')
      .where('gd.tipo = :type', { type })
      .orderBy('gd."createdAt"', 'DESC')
      .limit(10)
      .getRawMany();

    return rows.map(
      (row) =>
        new GuiaDescarga({
          id: row.id,
          id_guia: row.id_guia,
          orden: row.orden,
          item: row.item,
          cliente: row.cliente,
          centrocosto: row.centrocosto,
          destino: row.destino,
          fecha_descarga: row.fecha_descarga,
          hora_descarga: row.hora_descarga,
          guia_estado: row.guia_estado,
          usuario: row.usuario,
        }),
    );
  }
}
