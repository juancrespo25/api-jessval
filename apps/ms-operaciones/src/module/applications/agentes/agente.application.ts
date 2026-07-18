import { IAgentePort } from "../../ports/agentes";
import { Agente } from "./agente";

export class AgenteApplication implements IAgentePort {
  constructor(private readonly agentePort: IAgentePort) {}

  async findAllStatus(status?: boolean): Promise<Agente[]> {
    return this.agentePort.findAllStatus(status);
  }

  async save(agente: Agente): Promise<Agente> {
    return this.agentePort.save(agente);
  }
}