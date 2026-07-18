import { IDestinatarioPort } from "../../ports/destinatario";
import { Destinatario } from "./destinatario";

export class DestinatarioApplication implements IDestinatarioPort {
  constructor(private readonly destinatarioPort: IDestinatarioPort) {}
  async findByName(nombres: string, customer: string, ccosto: string): Promise<Destinatario[] | null> {
    return await this.destinatarioPort.findByName(nombres, customer, ccosto);
  }
}