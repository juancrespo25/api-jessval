import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IGuiaDespachoPort } from '../../ports/guiadespacho';
import { GuiaDespacho } from '../../applications/guiadespacho';
import { GuiaDespachoEntity } from './entities';
import { Repository } from 'typeorm';

export class GuiaDespachoAdapter implements IGuiaDespachoPort {
  private repository: Repository<GuiaDespachoEntity> | null = null;

  private getRepository(): Repository<GuiaDespachoEntity> {
      if (!this.repository) {
        if (!DataBaseBootstrapp.dataSource) {
          throw new Error('Database connection not initialized');
        }
        this.repository = DataBaseBootstrapp.dataSource.getRepository(GuiaDespachoEntity);
      }
      return this.repository;
    }

  async addGuia(guiaDespacho: GuiaDespacho): Promise<GuiaDespacho> {

    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const guiaDespachoEntity = this.getRepository().create({
      despacho: { id: guiaDespacho.properties().despacho },
      id_guia: guiaDespacho.properties().id_guia,
      estado: guiaDespacho.properties().estado,
      userCreated: guiaDespacho.properties().userCreated,
    });

    const savedGuiaDespachoEntity = await this.getRepository().save(guiaDespachoEntity);

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