import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IDestinatarioPort } from '../../ports/destinatario';
import { Destinatario } from '../../applications/destinatario';
import { DestinatarioEntity } from './entities';
import { Like, Repository } from 'typeorm';

export class DestinatarioAdapter implements IDestinatarioPort {

  private repository: Repository<DestinatarioEntity> | null = null;

  private getRepository(): Repository<DestinatarioEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(DestinatarioEntity);
    }
    return this.repository;
  }

  async findByName(nombres: string, customer: string, ccosto: string): Promise<Destinatario[] | null> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const destinatarioEntity = await this.getRepository()
    .findBy(
      {
        nombres: Like(`%${nombres.toUpperCase()}%`),
        cliente: customer,
        ccosto: ccosto
      }
    );

    if (!destinatarioEntity || destinatarioEntity.length === 0) {
      return null;
    }

    const destinatarios = destinatarioEntity.map(entity => new Destinatario({
      id: entity.id,
      nombres: entity.nombres,
      cliente: entity.cliente,
      ccosto: entity.ccosto,
      ubigeo: entity.ubigeo,
      direccion: entity.direccion
    }));

    return destinatarios;
  }

}