import { ITipoEnvioPort } from '../../ports/tipoenvio';
import { TipoEnvio } from './tipoenvio';

export class TipoEnvioApplication implements ITipoEnvioPort {
  constructor(private readonly tipoEnvioPort: ITipoEnvioPort) {}

  async findAll(estado?: boolean, linea?: number): Promise<TipoEnvio[]> {
    return await this.tipoEnvioPort.findAll(estado, linea);
  }

  async save(tipoEnvio: TipoEnvio): Promise<TipoEnvio> {
    return await this.tipoEnvioPort.save(tipoEnvio);
  }
}
