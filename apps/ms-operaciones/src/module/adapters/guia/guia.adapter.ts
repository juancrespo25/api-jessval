import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IGuiaPort } from '../../ports/guia';
import { Guia } from '../../applications/guia';
import { GuiaEntity } from './entities';
import { Repository } from 'typeorm';
import { DestinatarioEntity } from '../destinatario/entities';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';
import { OrdenEntity } from '../orden/entities';

export class GuiaAdapter implements IGuiaPort {
  private repository: Repository<GuiaEntity> | null = null;

  private getRepository(): Repository<GuiaEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(GuiaEntity);
    }
    return this.repository;
  }
  async save(guia: Guia): Promise<Guia> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const savedGuia = await DataBaseBootstrapp.dataSource.transaction(async (manager) => {
      const guiaEntity = new GuiaEntity();
      let iddestinatario = Number(guia.properties.destinatario);

      if (iddestinatario === 0) {
        console.log(guia);
        const destinatarioEntity = new DestinatarioEntity();
        Object.assign(destinatarioEntity, {
          nombres: guia.properties.destinatario_name.toUpperCase(),
          cliente: guia.properties.customer,
          ccosto: guia.properties.ccosto,
          ubigeo: guia.properties.destino,
          direccion: guia.properties.direccion,
        });

        const save = await manager.save(DestinatarioEntity, destinatarioEntity);
        console.log(save);
        iddestinatario = save.id;
      }

      // Buscar la orden relacionada
      const ordenEntity = await manager.findOne(OrdenEntity, {
        where: { id: guia.properties.orden },
      });

      if (!ordenEntity) {
        throw new Error(`Orden con id ${guia.properties.orden} no encontrada`);
      }

      Object.assign(guiaEntity, {
        id_guia: guia.properties.id_guia,
        item: guia.properties.item,
        orden: ordenEntity,
        empresa: guia.properties.empresa,
        destinatario: iddestinatario,
        direccion: guia.properties.direccion,
        tarifa: guia.properties.tarifa,
        peso: guia.properties.peso,
        bultos: guia.properties.bultos,
        unidades: guia.properties.unidades,
        origen: guia.properties.origen,
        destino: guia.properties.destino,
        tenvio: guia.properties.tenvio,
        contenido: guia.properties.contenido,
        observaciones: guia.properties.observaciones,
        estado: 'PD',
        digitalizado: false,
        fecha: new Date(),
        userCreated: guia.properties.userCreated,
      });
      const saved = await manager.save(GuiaEntity, guiaEntity);

      const movimientoEntity = new MovimientoEntity();

      Object.assign(movimientoEntity, {
        id_guia: saved.id_guia,
        modulo: 'Registro de Orden',
        detalle: 'Pendiente',
        userCreated: guia.properties.userCreated,
      });

      await manager.save(MovimientoEntity, movimientoEntity);

      return saved;
    });

    return new Guia({ ...guia.properties, id: savedGuia.id, destinatario: savedGuia.destinatario });
  }

  async validateGuia(id_guia: number): Promise<Guia | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guia = await this.getRepository()
      .createQueryBuilder('guia')
      .innerJoin('orden', 'o', 'guia.orden = o.id')
      .innerJoin('customer', 'c', 'o.customer = c.codigo')
      .addSelect('c.descripcion', 'customer_name')
      .innerJoin('centrocosto', 'cc', 'o.ccosto = cc.codigo')
      .addSelect('cc.descripcion', 'ccosto_name')
      .innerJoin('destinatario', 'd', 'guia.destinatario = d.id')
      .addSelect('d.nombres', 'destinatario_name')
      .leftJoin('guiamanifiesto', 'gm', 'gm.id_guia = guia.id_guia')
      .addSelect('guia.id_guia', 'id_guia')
      .addSelect('guia.estado', 'estado')
      .innerJoin('ubigeo', 'u', 'guia.destino = u.codigo')
      .addSelect('u.codprovincia', 'provincia')
      .addSelect("CONCAT(u.distrito, ' - ', u.provincia)", 'destino')
      .where('guia.id_guia = :id_guia', { id_guia })
      .getRawOne();

    if (!guia) {
      return null;
    }

    return new Guia({
      id_guia: guia.id_guia,
      estado: guia.estado,
      provincia: guia.provincia,
      customer: guia.customer_name,
      ccosto: guia.ccosto_name,
      destinatario_name: guia.destinatario_name,
      destino: guia.destino,
    });
  }
}
