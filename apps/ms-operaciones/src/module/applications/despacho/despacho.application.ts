import { IDespachoPort } from "../../ports/despacho";
import { Despacho } from "./despacho";

export class DespachoApplication implements IDespachoPort {
  constructor(private readonly despachoPort: IDespachoPort) {}
  findById(id: number): Promise<Despacho | null> {
    return this.despachoPort.findById(id);
  }

  findAll(fecha_inicial: Date, fecha_final: Date, agente: number, estado: string): Promise<Despacho[] | null> {
    return this.despachoPort.findAll(fecha_inicial, fecha_final, agente, estado);
  }

  save(despacho: Despacho): Promise<Despacho> {
    return this.despachoPort.save(despacho);
  }
}