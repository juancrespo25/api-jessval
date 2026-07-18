import { IMotivoPort } from "../../ports/motivos";
import { Motivo } from "./motivo";

export class MotivoApplication implements IMotivoPort {

  constructor(private readonly motivoPort: IMotivoPort) {}
  async findAll(estado?: boolean, tipo?: number): Promise<Motivo[]> {
    return await this.motivoPort.findAll(estado, tipo);
  }

  async save(motivo: Motivo): Promise<Motivo> {
    return await this.motivoPort.save(motivo);
  }
}