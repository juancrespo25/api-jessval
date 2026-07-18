import { Destinatario } from "../../applications/destinatario";

export interface IDestinatarioPort {
  findByName(nombres: string, customer: string, ccosto: string): Promise<Destinatario[] | null>;
}