import { IGuiaDespachoPort } from '../../ports/guiadespacho';
import { GuiaDespacho } from './guiadespacho';

export class GuiaDespachoApplication implements IGuiaDespachoPort {
  constructor(private readonly guiaDespachoPort: IGuiaDespachoPort) {}

  async addGuia(guiaDespacho: GuiaDespacho): Promise<GuiaDespacho> {
    return await this.guiaDespachoPort.addGuia(guiaDespacho);
  }
}
