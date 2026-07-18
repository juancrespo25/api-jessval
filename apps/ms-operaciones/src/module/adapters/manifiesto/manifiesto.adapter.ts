import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IManifiestoPort } from '../../ports/manifiesto';
import { Manifiesto } from '../../applications/manifiesto';
import { GuiaManifiestoEntity } from '../guiamanifiesto/entities';
import { ManifiestoEntity } from './entities';
import { Between, Repository } from 'typeorm';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';
import { GuiaEntity } from '../guia/entities';

export class ManifiestoAdapter implements IManifiestoPort {
  private repository: Repository<ManifiestoEntity> | null = null;

  private getRepository(): Repository<ManifiestoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(ManifiestoEntity);
    }
    return this.repository;
  }

  async save(manifiesto: Manifiesto): Promise<Manifiesto> {
    const { codigo, estado, courier, zona, guias = [] } = manifiesto.properties;

    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const saveManifiesto = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const manifiestoEntity = new ManifiestoEntity();
      Object.assign(manifiestoEntity, {
        codigo,
        estado,
        courier,
        zona,
        userCreated: manifiesto.properties.userCreated,
        createdAt: new Date(),
      });
      const saved = await manager.save(manifiestoEntity);

      const guiaManifiestoEntities = await Promise.all(
        guias.map(async (guia) => {
          const guiaManifiestoEntity = new GuiaManifiestoEntity();

          Object.assign(guiaManifiestoEntity, {
            manifiesto: manifiestoEntity.id,
            id_guia: guia.id_guia,
            ordenamiento: guia.ordenamiento,
            estado: guia.estado,
          });

          await manager.update(
            GuiaEntity,
            { id_guia: guia.id_guia },
            {
              estado: 'ER',
              userUpdated: manifiesto.properties.userCreated,
              updatedAt: new Date(),
            },
          );

          const movimientoEntity = new MovimientoEntity();
          Object.assign(movimientoEntity, {
            id_guia: guia.id_guia,
            modulo: 'MANIFIESTO',
            detalle: 'EN RUTA',
            userCreated: manifiesto.properties.userCreated,
          });

          await manager.save(MovimientoEntity, movimientoEntity);

          return guiaManifiestoEntity;
        }),
      );

      if (guiaManifiestoEntities.length > 0) {
        await manager.save(guiaManifiestoEntities);
      }

      return saved;
    });

    return new Manifiesto({ ...manifiesto.properties, createdAt: saveManifiesto.createdAt });
  }

  async update(manifiesto: Manifiesto): Promise<Manifiesto> {
    const { codigo, estado, userUpdated, guias = [] } = manifiesto.properties;

    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const updatedManifiesto = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const manifiestoEntity = await manager.findOne(ManifiestoEntity, {
        where: { codigo },
      });

      if (!manifiestoEntity) {
        throw new Error('Manifiesto not found');
      }

      Object.assign(manifiestoEntity, {
        estado,
        userUpdated: userUpdated,
        updatedAt: new Date(),
      });

      const updatedManifiesto = await manager.update(
        ManifiestoEntity,
        { codigo },
        manifiestoEntity,
      );

      await Promise.all(
        guias.map(async (guia) => {
          //actualizando guiamanifiesto
          await manager.update(
            GuiaManifiestoEntity,
            { id_guia: guia.id_guia },
            {
              ordenamiento: guia.ordenamiento,
              estado: guia.estado,
              recibido: guia.recibido ?? null,
              parentesco: guia.parentesco ?? null,
              documento: guia.documento ?? null,
              motivo: guia.motivo ?? null,
              colorpuerta: guia.colorpuerta ?? null,
              suministro: guia.suministro ?? null,
              fecha_descarga: guia.fecha_descarga
                ? guia.fecha_descarga.toISOString().split('T')[0]
                : null,
              hora_descarga: guia.hora_descarga ?? null,
            },
          );

          //actualizando la guia
          await manager.update(
            GuiaEntity,
            { id_guia: guia.id_guia },
            {
              estado: guia.estado,
              userUpdated: userUpdated,
              updatedAt: new Date(),
            },
          );

          const movimientoEntity = new MovimientoEntity();
          Object.assign(movimientoEntity, {
            id_guia: guia.id_guia,
            modulo: 'MANIFIESTO',
            detalle: this.obtenerTextoEstado(guia.estado),
            userCreated: userUpdated,
          });

          await manager.save(MovimientoEntity, movimientoEntity);
        }),
      );

      return updatedManifiesto;
    });

    return new Manifiesto({ ...manifiesto.properties, updatedAt: new Date() });
  }

  async findAll(
    fecha_inicial: Date,
    fecha_final: Date,
    codigo: string,
    estado: string,
    courier: string,
    zona: string,
  ): Promise<Manifiesto[]> {
    const manifiestos = await this.getRepository().find({
      where: {
        createdAt: Between(fecha_inicial, fecha_final),
        codigo,
        estado,
        courier,
        zona,
      },
      relations: {
        guias: true,
      },
    });

    if (!manifiestos || manifiestos.length === 0) return [];

    return manifiestos.map((manifiesto) => {
      const guias = manifiesto.guias ?? [];
      return new Manifiesto({
        codigo: manifiesto.codigo,
        estado: manifiesto.estado,
        courier: manifiesto.courier,
        zona: manifiesto.zona,
        createdAt: manifiesto.createdAt,
        total: guias.length,
        total_pendientes: guias.filter((g) => g.estado === 'ER').length,
        total_entregados: guias.filter((g) => g.estado === 'EF').length,
        total_motivados: guias.filter((g) => g.estado === 'MT').length,
        total_retorno: guias.filter((g) => g.estado === 'RT').length,
      });
    });
  }

  async findByCodigo(codigo: string): Promise<Manifiesto | null> {
    const { entities, raw } = await this.getRepository()
      .createQueryBuilder('manifiesto')
      .innerJoinAndSelect('manifiesto.guias', 'guias')
      .innerJoin('user', 'u', 'TRIM(manifiesto.courier) = TRIM(u.codigo)')
      .addSelect("CONCAT(u.nombres, ' ', u.apellidos)", 'nombre_courier')
      .innerJoin('zonas', 'z', 'TRIM(manifiesto.zona) = TRIM(z.codigo)')
      .addSelect('z.descripcion', 'zona_name')
      .where('manifiesto.codigo = :codigo', { codigo })
      .getRawAndEntities();

    if (!entities.length) return null;

    const manifiestoEntity = entities[0];
    const guias = manifiestoEntity.guias ?? [];
    const nombre_courier: string | undefined = raw[0]?.nombre_courier ?? undefined;
    const zona_name: string | undefined = raw[0]?.zona_name ?? undefined;

    return new Manifiesto({
      codigo: manifiestoEntity.codigo,
      estado: manifiestoEntity.estado,
      nombre_courier,
      zona_name,
      createdAt: manifiestoEntity.createdAt,
      total: guias.length,
      total_pendientes: guias.filter((g) => g.estado === 'ER').length,
    });
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'EF':
        return 'ENTREGADO';
      case 'MT':
        return 'MOTIVADO';
      case 'RT':
        return 'RETORNO';
      default:
        return 'ENTREGADO';
    }
  }
}
