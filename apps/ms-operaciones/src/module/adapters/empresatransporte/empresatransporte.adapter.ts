import { DataBaseBootstrapp } from '../../../bootstrapp';
import { IEmpresaTransportePort } from '../../ports/empresatransporte';
import { EmpresaTransporte } from '../../applications/empresatransporte';
import { EmpresaTransporteEntity } from './entities';
import { Repository } from 'typeorm';

export class EmpresaTransporteAdapter implements IEmpresaTransportePort {
  private repository: Repository<EmpresaTransporteEntity> | null = null;

  getRepository(): Repository<EmpresaTransporteEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(EmpresaTransporteEntity);
    }
    return this.repository;
  }

  async findAllStatus(status: boolean, tipo_envio: number): Promise<EmpresaTransporte[]> {
    if (!DataBaseBootstrapp.dataSource) {
      throw new Error('Database connection not initialized');
    }

    const empresaTransporteEntity = await this.getRepository().findBy({ estado: status, tipoenvio: tipo_envio });
    if (!empresaTransporteEntity || empresaTransporteEntity.length === 0) {
      return [];
    }
    return empresaTransporteEntity.map(
      (entity) =>
        new EmpresaTransporte({
          id: entity.id,
          descripcion: entity.descripcion
        }),
    );
  }

  async create(empresaTransporte: EmpresaTransporte): Promise<EmpresaTransporte> {
    const { id, descripcion, direccion, ubigeo, telefono, contacto, tipoenvio, estado } =
      empresaTransporte.properties;

    const empresaTransporteEntity = new EmpresaTransporteEntity();

    Object.assign(empresaTransporteEntity, {
      id,
      descripcion,
      direccion,
      ubigeo,
      telefono,
      contacto,
      tipoenvio,
      estado,
    });

    const saved = await this.getRepository().save(empresaTransporteEntity);

    return new EmpresaTransporte({
      id: saved.id,
      descripcion: saved.descripcion,
      estado: saved.estado,
    });
  }
}
