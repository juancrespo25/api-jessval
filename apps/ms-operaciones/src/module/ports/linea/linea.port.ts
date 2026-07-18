import { Linea } from '../../applications/linea';

export interface ILineaPort {
  findAll(estado?: boolean): Promise<Linea[]>;

  save(linea: Linea): Promise<Linea>;
}
