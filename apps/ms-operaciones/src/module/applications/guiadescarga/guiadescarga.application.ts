import { IGuiaDescargaPort } from '../../ports/guiadescarga';
import { GuiaDescarga } from './guiadescarga';

export class GuiaDescargaApplication implements IGuiaDescargaPort {
  constructor(private readonly guiaDescargaPort: IGuiaDescargaPort) {}

  async save(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga> {
    return await this.guiaDescargaPort.save(guiaDescarga);
  }

  async getAllType(type: string): Promise<GuiaDescarga[]> {
    return await this.guiaDescargaPort.getAllType(type);
  }

  async getById(id_guia: number): Promise<GuiaDescarga> {
    return await this.guiaDescargaPort.getById(id_guia);
  }

  async update(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga> {
    return await this.guiaDescargaPort.update(guiaDescarga);
  }

}