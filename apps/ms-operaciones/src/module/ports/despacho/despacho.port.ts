import { Despacho } from '../../applications/despacho';

export interface IDespachoPort {
  findById(id: number): Promise<Despacho | null>;
  findAll(fecha_inicial: Date, fecha_final: Date, agente: number, estado: string): Promise<Despacho[] | null>;
  save(despacho: Despacho): Promise<Despacho>;
}