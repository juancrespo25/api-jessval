import { IContenidoPort } from '../../ports/contenido';
import { Contenido } from './contenido';

export class ContenidoApplication implements IContenidoPort {
  constructor(private readonly contenidoPort: IContenidoPort) {}
  async findAll(status?: boolean): Promise<Contenido[]> {
    return await this.contenidoPort.findAll(status);
  }

  async save(contenido: Contenido): Promise<Contenido> {
    return await this.contenidoPort.save(contenido);
  }

  async update(contenido: Contenido): Promise<Contenido | null> {
    return await this.contenidoPort.update(contenido);
  }
}
