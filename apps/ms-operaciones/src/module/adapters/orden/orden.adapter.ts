import { DataBaseBootstrapp } from '../../../bootstrapp';
import { FiltrosQueryOrden, GuiaImpresion, IOrdenPort, OrdenDetalle, ResultadoQueryOrden } from '../../ports/orden';
import { Orden } from '../../applications/orden';
import { OrdenEntity } from './entities';
import { GuiaEntity } from '../guia/entities/guia.entity';
import { DestinatarioEntity } from '../destinatario/entities';
import { Repository } from 'typeorm';
import { MovimientoEntity } from '../movimiento/entities/movimiento.entity';
import { DocAdjuntoEntity } from '../docadjunto/entities';

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

  async getOrdenByCode(numero: number): Promise<OrdenDetalle | null> {
    const rows: OrdenDetalle[] = await this.getRepository().query(
      `SELECT o.numero, c.descripcion AS cliente, cc.descripcion AS centrocosto,
        concat_ws(' - ', u.departamento, u.provincia, u.distrito) AS origen,
        p.descripcion AS provincia_cubierta, o.fecha_registro,
        concat_ws(' - ', us.nombres, us.apellidos) AS usuario,
        COALESCE((
          SELECT json_agg(json_build_object(
            'id_guia', g.id_guia,
            'nombres', d.nombres,
            'direccion', g.direccion,
            'destino', concat_ws(' - ', ud.departamento, ud.provincia, ud.distrito),
            'estado', CASE g.estado
              WHEN 'PD' THEN 'Pendiente'
              WHEN 'MT' THEN 'Motivado'
              WHEN 'EF' THEN 'Entregado'
              WHEN 'RT' THEN 'Retorno'
              WHEN 'DP' THEN 'Despachado'
              WHEN 'ET' THEN 'En transito'
              ELSE g.estado
            END
          ) ORDER BY g.item, g.id)
          FROM guia g
          INNER JOIN destinatario d ON d.id = g.destinatario
            AND d.cliente = o.customer AND d.ccosto = o.ccosto
          INNER JOIN ubigeo ud ON g.destino = ud.codigo
          WHERE g.orden_id = o.id
        ), '[]'::json) AS envios
       FROM orden o
       INNER JOIN customer c ON o.customer = c.codigo
       INNER JOIN centrocosto cc ON o.ccosto = cc.codigo
       INNER JOIN ubigeo u ON o.origen = u.codigo
       INNER JOIN provincia p ON u.codprovincia = p.codigo
       INNER JOIN "user" us ON o."userCreated" = us.codigo
       WHERE o.numero = $1`,
      [numero],
    );
    return rows[0] ?? null;
  }

  async queryOrden(filtros: FiltrosQueryOrden): Promise<ResultadoQueryOrden[]> {
    const parametros: (string | number)[] = [filtros.fecha_inicial, filtros.fecha_final];
    const condiciones = [
      'o.fecha_registro >= $1::date',
      "o.fecha_registro < $2::date + INTERVAL '1 day'",
    ];
    const opcionales: [string, string | number | undefined][] = [
      ['g.estado', filtros.estado],
      ['pd.codigo', filtros.destino],
      ['po.codigo', filtros.origen],
      ['o.customer', filtros.customer],
      ['o.ccosto', filtros.ccosto],
      ['o.numero', filtros.numero],
    ];
    for (const [columna, valor] of opcionales) {
      if (valor !== undefined) {
        parametros.push(valor);
        condiciones.push(`${columna} = $${parametros.length}`);
      }
    }
    if (filtros.nombre !== undefined) {
      parametros.push(filtros.nombre.replace(/[\\%_]/g, '\\$&'));
      condiciones.push(`UPPER(d.nombres) LIKE '%' || UPPER($${parametros.length}) || '%' ESCAPE E'\\\\'`);
    }
    if (filtros.numero_documento !== undefined) {
      parametros.push(filtros.numero_documento);
      condiciones.push(`EXISTS (SELECT 1 FROM docadjunto da WHERE da."idGuiaId" = g.id AND da.numero = $${parametros.length})`);
    }

    return this.getRepository().query(
      `SELECT g.id_guia, c.descripcion AS cliente, cc.descripcion AS ccosto,
        d.nombres, g.direccion,
        concat_ws(' - ', ud.departamento, ud.provincia, ud.distrito) AS destino,
        o.fecha_registro,
        CASE g.estado
          WHEN 'PD' THEN 'Pendiente'
          WHEN 'MT' THEN 'Motivado'
          WHEN 'EF' THEN 'Entregado'
          WHEN 'RT' THEN 'Retorno'
          WHEN 'DP' THEN 'Despachado'
          WHEN 'ET' THEN 'En transito'
          ELSE g.estado
        END AS estado,
        (SELECT count(*)::int FROM docadjunto da WHERE da."idGuiaId" = g.id) AS total_documentos
       FROM guia g
       INNER JOIN orden o ON o.id = g.orden_id
       INNER JOIN customer c ON c.codigo = o.customer
       INNER JOIN centrocosto cc ON cc.cliente = o.customer AND cc.codigo = o.ccosto
       INNER JOIN destinatario d ON d.cliente = o.customer AND d.ccosto = o.ccosto AND d.id = g.destinatario
       INNER JOIN ubigeo ud ON ud.codigo = g.destino
       INNER JOIN provincia pd ON ud.codprovincia = pd.codigo
       INNER JOIN ubigeo uo ON g.origen=uo.codigo
       INNER JOIN provincia po ON uo.codprovincia=po.codigo
       WHERE ${condiciones.join(' AND ')}
       ORDER BY o.fecha_registro DESC, g.id`,
      parametros,
    );
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
        const savedGuias = await manager.save(GuiaEntity, guiaEntities);
        const docAdjuntoEntities = savedGuias.flatMap((guiaEntity, index) =>
          (guias[index].docadjuntos ?? []).map((docadjunto) => {
            const docAdjuntoEntity = new DocAdjuntoEntity();
            Object.assign(docAdjuntoEntity, {
              id_guia: guiaEntity,
              numero: docadjunto.numero,
              tipo: docadjunto.tipo,
            });
            return docAdjuntoEntity;
          }),
        );

        if (docAdjuntoEntities.length > 0) {
          await manager.save(DocAdjuntoEntity, docAdjuntoEntities);
        }
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

  async getGuiasImpresion(numero: number, itemDesde?: number, itemHasta?: number): Promise<GuiaImpresion[]> {
    if ((itemDesde === undefined) !== (itemHasta === undefined)) {
      throw new Error('itemDesde and itemHasta must be provided together');
    }

    const hasRange = itemDesde !== undefined;
    return this.getRepository().query(
      `SELECT
        o.numero, g.item, g.id_guia, o.fecha_registro,
        c.descripcion AS cliente, g.empresa, d.nombres AS destinatario,p.descripcion  AS provincia_padre,
        g.direccion, ud.departamento, ud.provincia AS provincia, ud.distrito,
        ct.descripcion AS contenido, g.bultos, g.unidades, g.peso, g.observaciones,
        (SELECT string_agg(
          CASE da.tipo
            WHEN 1 THEN 'Factura'
            WHEN 2 THEN 'Guia Remision'
            WHEN 3 THEN 'Orden de Servicio'
            ELSE 'Otro'
          END || ': ' || COALESCE(da.numero::text, ''),
          ' | ' ORDER BY da.tipo, da.numero)
         FROM docadjunto da
         WHERE da."idGuiaId" = g.id) AS documentos
       FROM orden o
       INNER JOIN guia g ON g.orden_id = o.id
       INNER JOIN customer c ON c.codigo = o.customer
       LEFT JOIN ubigeo ud ON ud.codigo = g.destino
       LEFT JOIN provincia p ON p.codigo = ud.codprovincia
       LEFT JOIN destinatario d ON d.id = g.destinatario AND d.cliente = c.codigo
       LEFT JOIN contenido ct ON ct.id = g.contenido
       WHERE o.numero = $1${hasRange ? ' AND g.item BETWEEN $2 AND $3' : ''}
       ORDER BY g.item ASC`,
      hasRange ? [numero, itemDesde, itemHasta] : [numero],
    );
  }
}
