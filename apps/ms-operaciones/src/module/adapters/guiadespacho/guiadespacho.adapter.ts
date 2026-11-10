import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IGuiaDespachoPort } from '../../ports/guiadespacho';
import { GuiaDespacho } from '../../applications/guiadespacho';
import { GuiaDespachoEntity } from './entities';
import { Repository } from 'typeorm';
import { GuiaEntity } from '../guia/entities';

export class GuiaDespachoAdapter implements IGuiaDespachoPort {
  private guiaDespachoRepository: Repository<GuiaDespachoEntity> | null = null;
  private guiaRepository: Repository<GuiaEntity> | null = null;

  private getGuiaDespachoRepository(): Repository<GuiaDespachoEntity> {
    if (!this.guiaDespachoRepository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.guiaDespachoRepository = DataBaseBootstrapp.dataSource.getRepository(GuiaDespachoEntity);
    }
    return this.guiaDespachoRepository;
  }

  private getGuiaRepository(): Repository<GuiaEntity> {
    if (!this.guiaRepository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.guiaRepository = DataBaseBootstrapp.dataSource.getRepository(GuiaEntity);
    }
    return this.guiaRepository;
  }

  async validate(guia: number): Promise<GuiaDespacho> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guiaDespachoEntity = await this.getGuiaRepository()
      .createQueryBuilder('guia')
      .innerJoin('ubigeo', 'u', 'guia.destino = u.codigo')
      .addSelect('guia.id_guia', 'id_guia')
      .addSelect('guia.estado', 'estado')
      .addSelect('u.codprovincia', 'provincia')
      .addSelect("CONCAT(u.distrito, ' - ', u.provincia)", 'destino')
      .innerJoin("destinatario", "d", "guia.destinatario = d.id")
      .addSelect("d.nombres", "dnombres")
      .where('guia.id_guia = :guia', { guia })
      .getRawOne();

    if (!guiaDespachoEntity) {
      throw new Error('Guía de despacho no encontrada');
    }

    return new GuiaDespacho({
      id_guia: guiaDespachoEntity.id_guia,
      estado: guiaDespachoEntity.estado,
      provincia: guiaDespachoEntity.provincia,
      destino: guiaDespachoEntity.destino,
      dnombres: guiaDespachoEntity.dnombres,
    });
  }
  async addGuia(guiaDespacho: GuiaDespacho): Promise<GuiaDespacho> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guiaDespachoEntity = this.getGuiaDespachoRepository().create({
      despacho: { id: guiaDespacho.properties().despacho },
      id_guia: guiaDespacho.properties().id_guia,
      estado: guiaDespacho.properties().estado,
      userCreated: guiaDespacho.properties().userCreated,
    });

    const savedGuiaDespachoEntity = await this.getGuiaDespachoRepository().save(guiaDespachoEntity);

    return new GuiaDespacho({
      id: savedGuiaDespachoEntity.id,
      despacho: savedGuiaDespachoEntity.despacho.id,
      id_guia: savedGuiaDespachoEntity.id_guia,
      estado: savedGuiaDespachoEntity.estado,
      userCreated: savedGuiaDespachoEntity.userCreated,
      createdAt: savedGuiaDespachoEntity.createdAt,
    });
  }
}
