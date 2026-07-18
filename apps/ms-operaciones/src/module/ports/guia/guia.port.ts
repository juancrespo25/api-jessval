import { Guia } from '../../applications/guia';

export interface IGuiaPort {
  save(guia: Guia): Promise<Guia>;
  validateGuia(id_guia: number): Promise<Guia | null>;
}