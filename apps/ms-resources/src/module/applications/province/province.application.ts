import { IProvincePort } from '../../ports/province';
import { Province } from './province';

export class ProvinceApplication {
    constructor(private readonly provincePort: IProvincePort){}

    async findByAll(status: string): Promise<Province[]> {
        return await this.provincePort.findByAll(status);
    }
  }