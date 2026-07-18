import { Motivo } from "../../applications/motivos";

export interface IMotivoPort {
  findAll(estado?: boolean, tipo?: number): Promise<Motivo[]>;
  save(motivo: Motivo): Promise<Motivo>;
}