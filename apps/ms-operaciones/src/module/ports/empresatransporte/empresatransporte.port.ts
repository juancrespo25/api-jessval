import { EmpresaTransporte } from '../../applications/empresatransporte';

export interface IEmpresaTransportePort {
  findAllStatus(status: boolean, tipo_envio: number): Promise<EmpresaTransporte[]>;
  create(empresaTransporte: EmpresaTransporte): Promise<EmpresaTransporte>;
}