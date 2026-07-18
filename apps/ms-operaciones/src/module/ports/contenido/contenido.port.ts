import { Contenido } from '../../applications/contenido';

export interface IContenidoPort {
  findAll(status?: boolean): Promise<Contenido[]>;

  save(contenido: Contenido): Promise<Contenido>;

  update(contenido: Contenido): Promise<Contenido | null>;
}
