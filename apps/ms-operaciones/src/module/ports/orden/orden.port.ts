import { Orden } from '../../applications/orden';

export interface IOrdenPort {
  findById(numero: number): Promise<Orden | null>;
  getOrdenToday(): Promise<Orden[]>;
  save(orden: Orden): Promise<Orden>;
}
