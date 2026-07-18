import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IOrdenPort } from '../../ports/orden';
import { Orden } from '../../applications/orden';
import { OrdenEntity } from './entities';
import { GuiaEntity } from '../guia/entities/guia.entity';
import { DestinatarioEntity } from '../destinatario/entities';
import { Repository } from 'typeorm';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';

export class OrdenAdapter implements IOrdenPort {
  private repository: Repository<OrdenEntity> | null = null;

  private getRepository(): Repository<OrdenEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(OrdenEntity);
    }
    return this.repository;
  }
  async findById(numero: number): Promise<Orden | null> {
    const ordenEntity = await this.getRepository().findOne({
      where: { numero },
    });
    if (!ordenEntity) return null;

    // Obtener el máximo valor del campo item de las guías relacionadas
    const maxItemResult = await this.getRepository()
      .createQueryBuilder('orden')
      .leftJoin('orden.guias', 'guia')
      .select('MAX(guia.item)', 'maxItem')
      .where('orden.numero = :numero', { numero })
      .getRawOne();

    const maxItem =
      maxItemResult && maxItemResult.maxItem ? parseInt(maxItemResult.maxItem, 10) : null;

    const ordenProps = {
      id: ordenEntity.id,
      numero: ordenEntity.numero,
      customer: ordenEntity.customer,
      ccosto: ordenEntity.ccosto,
      provincia: ordenEntity.provincia,
      origen: ordenEntity.origen,
      fecha_registro: ordenEntity.fecha_registro,
      maxItem,
    };

    return new Orden(ordenProps);
  }

  async save(orden: Orden): Promise<Orden> {
    const {
      numero,
      customer,
      ccosto,
      provincia,
      origen,
      fecha_registro,
      userCreated,
      guias = [],
    } = orden.properties;

    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const savedOrden = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const ordenEntity = new OrdenEntity();

      Object.assign(ordenEntity, {
        numero,
        customer,
        ccosto,
        provincia,
        origen,
        fecha_registro,
        userCreated,
      });

      const saved = await manager.save(OrdenEntity, ordenEntity);

      const guiaEntities = await Promise.all(
        guias.map(async (guia) => {
          const guiaEntity = new GuiaEntity();
          let iddestinatario = Number(guia.destinatario);

          if (iddestinatario === 0) {
            const destinatarioEntity = new DestinatarioEntity();
            Object.assign(destinatarioEntity, {
              nombres: guia.destinatario_name.toUpperCase(),
              cliente: customer,
              ccosto: ccosto,
              ubigeo: guia.destino,
              direccion: guia.direccion,
            });

            const save = await manager.save(DestinatarioEntity, destinatarioEntity);
            iddestinatario = save.id;
          }

          Object.assign(guiaEntity, {
            id_guia: guia.id_guia,
            item: guia.item,
            orden: saved,
            empresa: guia.empresa,
            destinatario: iddestinatario,
            direccion: guia.direccion,
            tarifa: guia.tarifa,
            peso: guia.peso,
            bultos: guia.bultos,
            unidades: guia.unidades,
            origen: guia.origen,
            destino: guia.destino,
            tenvio: guia.tenvio,
            contenido: guia.contenido,
            observaciones: guia.observaciones,
            estado: guia.estado,
            digitalizado: guia.digitalizado,
            fecha: guia.fecha ?? new Date(),
            userCreated,
          });

          const movimientoEntity = new MovimientoEntity();

          Object.assign(movimientoEntity, {
            id_guia: guia.id_guia,
            modulo: 'REGISTRO DE ORDEN',
            detalle: 'PENDIENTE',
            userCreated: userCreated,
          });
          await manager.save(MovimientoEntity, movimientoEntity);

          return guiaEntity;
        }),
      );

      if (guiaEntities.length > 0) {
        await manager.save(GuiaEntity, guiaEntities);
      }

      return saved;
    });

    return new Orden({ ...orden.properties, id: savedOrden.id });
  }

  async getOrdenToday(): Promise<Orden[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    //tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    console.log(today);
    console.log(tomorrow);

    const ordenEntities = await this.getRepository()
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.guias', 'guia')
      .innerJoin('customer', 'customer', 'orden.customer = customer.codigo')
      .addSelect('customer.descripcion', 'customerDescripcion')
      .innerJoin('centrocosto', 'centrocosto', 'orden.ccosto = centrocosto.codigo')
      .addSelect('centrocosto.descripcion', 'ccostoDescripcion')
      .innerJoin('provincia', 'provincia', 'orden.provincia = provincia.codigo')
      .addSelect('provincia.descripcion', 'provinciaDescripcion')
      .innerJoin('ubigeo', 'ubigeo', 'orden.origen = ubigeo.codigo')
      .addSelect('ubigeo.distrito', 'ubigeoDistrito')
      .innerJoin('user', 'user_tabla', 'orden.userCreated = user_tabla.codigo')
      .addSelect("user_tabla.nombres || ' ' || user_tabla.apellidos", 'userNombre')
      .where('orden.fecha_registro >= :today AND orden.fecha_registro < :tomorrow', {
        today,
        tomorrow,
      })
      .getRawAndEntities();

    if (!ordenEntities || ordenEntities.entities.length === 0) return [];

    return ordenEntities.entities.map(
      (entity: any, index: number) =>
        new Orden({
          id: entity.id,
          numero: entity.numero,
          customer: entity.customer,
          customerDescripcion: ordenEntities.raw[index]?.customerDescripcion,
          ccosto: entity.ccosto,
          ccostoDescripcion: ordenEntities.raw[index]?.ccostoDescripcion,
          provincia: entity.provincia,
          provinciaDescripcion: ordenEntities.raw[index]?.provinciaDescripcion,
          origen: entity.origen,
          ubigeoDistrito: ordenEntities.raw[index]?.ubigeoDistrito,
          fecha_registro: entity.fecha_registro,
          userCreated: entity.userCreated,
          userNombre: ordenEntities.raw[index]?.userNombre,
          guiaCount: entity.guias?.length ?? 0,
        }),
    );
  }
}
