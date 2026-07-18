import { ILineaPort } from '../../ports/linea';
import { Linea } from './linea';

export class LineaApplication implements ILineaPort {
  constructor(private readonly lineaPort: ILineaPort) {}

  async findAll(estado?: boolean): Promise<Linea[]> {
    return await this.lineaPort.findAll(estado);
  }

  async save(linea: Linea): Promise<Linea> {
    return await this.lineaPort.save(linea);
  }
}
