import { IEmpresaTransportePort } from '../../ports/empresatransporte';
import { EmpresaTransporte } from './empresatransporte';

export class EmpresaTransporteApplication implements IEmpresaTransportePort {
  constructor(private readonly empresaTransportePort: IEmpresaTransportePort) {}

  async findAllStatus(status: boolean, tipo_envio: number): Promise<EmpresaTransporte[]> {
    return await this.empresaTransportePort.findAllStatus(status, tipo_envio);
  }

  async create(empresaTransporte: EmpresaTransporte): Promise<EmpresaTransporte> {
    return await this.empresaTransportePort.create(empresaTransporte);
  }
}