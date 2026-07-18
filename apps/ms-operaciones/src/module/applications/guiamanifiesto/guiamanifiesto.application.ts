import { IGuiaManifiestoPort } from '../../ports/guiamanifiesto';
import { GuiaManifiesto } from './guiamanifiesto';

export class GuiaManifiestoApplication {

  constructor(private readonly guiaManifiestoPort: IGuiaManifiestoPort) {}

  async validateGuia(id_guia: number): Promise<GuiaManifiesto | null> {
    return await this.guiaManifiestoPort.validateGuia(id_guia);
  }

  async updateGuiaManifiesto(guiaManifiesto: GuiaManifiesto): Promise<GuiaManifiesto | null> {
    return await this.guiaManifiestoPort.updateGuiaManifiesto(guiaManifiesto);
  }
}