import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IGuiaManifiestoPort } from '../../ports/guiamanifiesto';
import { GuiaManifiesto } from '../../applications/guiamanifiesto';
import { GuiaManifiestoEntity } from './entities';
import { Repository } from 'typeorm';

export class GuiaManifiestoAdapter implements IGuiaManifiestoPort {
  private repository: Repository<GuiaManifiestoEntity> | null = null;

  private getRepository(): Repository<GuiaManifiestoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(GuiaManifiestoEntity);
    }
    return this.repository;
  }
  async validateGuia(id_guia: number): Promise<GuiaManifiesto | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guia = await this.getRepository()
      .createQueryBuilder('guiaManifiesto')
      .innerJoin('guia', 'guia', 'guiaManifiesto.id_guia = guia.id_guia')
      .innerJoin('manifiesto', 'm', 'guiaManifiesto.manifiesto_id = m.id')
      .addSelect('m.codigo', 'codigo')
      .addSelect('guia.id_guia', 'id_guia')
      .addSelect('guia.estado', 'estado')
      .innerJoin('ubigeo', 'ubigeo', 'guia.destino = ubigeo.codigo')
      .addSelect('ubigeo.codprovincia', 'provincia')
      .where('guiaManifiesto.id_guia = :id_guia', { id_guia })
      .getRawOne();

    if (!guia) {
      return null;
    }

    return new GuiaManifiesto({
      id_guia: guia.id_guia,
      estado: guia.estado,
      provincia: guia.provincia,
      manifiesto: guia.codigo,
    });
  }

  async updateGuiaManifiesto(guiaManifiesto: GuiaManifiesto): Promise<GuiaManifiesto | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guiaManifiestoEntity = await this.getRepository().findOne({
      where: { id_guia: guiaManifiesto.properties().id_guia },
    });

    if (!guiaManifiestoEntity) {
      return null;
    }

    Object.assign(guiaManifiestoEntity, guiaManifiesto.properties());

    await this.getRepository().update(guiaManifiestoEntity.id_guia, guiaManifiestoEntity);
    return new GuiaManifiesto({
      id_guia: guiaManifiestoEntity.id_guia,
      ordenamiento: guiaManifiestoEntity.ordenamiento,
      estado: guiaManifiestoEntity.estado,
      recibido: guiaManifiestoEntity.recibido ?? undefined,
      parentesco: guiaManifiestoEntity.parentesco ?? undefined,
      documento: guiaManifiestoEntity.documento ?? undefined,
      motivo: guiaManifiestoEntity.motivo ?? undefined,
      colorpuerta: guiaManifiestoEntity.colorpuerta ?? undefined,
      suministro: guiaManifiestoEntity.suministro ?? undefined,
      fecha_descarga: guiaManifiestoEntity.fecha_descarga
        ? new Date(guiaManifiestoEntity.fecha_descarga)
        : undefined,
      hora_descarga: guiaManifiestoEntity.hora_descarga ?? undefined,
    });
  }
}
