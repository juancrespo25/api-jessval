import { IManifiestoPort } from "../../ports/manifiesto";
import { Manifiesto } from "./manifiesto";

export class ManifiestoApplication implements IManifiestoPort {
  constructor(private readonly manifiestoPort: IManifiestoPort) {}

  async save(manifiesto: Manifiesto): Promise<Manifiesto> {
    return await this.manifiestoPort.save(manifiesto);
  }

  async update(manifiesto: Manifiesto): Promise<Manifiesto> {
    return await this.manifiestoPort.update(manifiesto);
  }

  async findAll(fecha_inicial: Date, fecha_final: Date, codigo: string, estado: string, courier: string, zona: string): Promise<Manifiesto[]> {
    return await this.manifiestoPort.findAll(fecha_inicial, fecha_final, codigo, estado, courier, zona);
  }

  async findByCodigo(codigo: string): Promise<Manifiesto | null> {
    return await this.manifiestoPort.findByCodigo(codigo);
  }
}