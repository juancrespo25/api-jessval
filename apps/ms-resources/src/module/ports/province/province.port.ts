import { Province } from '../../applications/province';

export interface IProvincePort {
  findByAll(status: string): Promise<Province[]>;
}
