import { Agente } from "../../applications/agentes";

export interface IAgentePort {
  findAllStatus(status?: boolean): Promise<Agente[]>;
  save(agente: Agente): Promise<Agente>;
}