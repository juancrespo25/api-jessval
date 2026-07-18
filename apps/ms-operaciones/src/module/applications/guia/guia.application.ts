import { IGuiaPort } from '../../ports/guia';
import { Guia } from './guia';

export class GuiaApplication {
  constructor(private readonly guiaPort: IGuiaPort) {}

  async save(guia: Guia): Promise<Guia> {
    return await this.guiaPort.save(guia);
  }

  async validateGuia(id_guia: number): Promise<Guia | null> {
    return await this.guiaPort.validateGuia(id_guia);
  }
}