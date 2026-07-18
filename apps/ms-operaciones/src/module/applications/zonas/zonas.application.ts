import { IZonasPort } from "../../ports/zonas";
import { Zonas } from "./zonas";

export class ZonasApplication implements IZonasPort {
  constructor(private readonly zonasPort: IZonasPort) { }

  async save(zonas: Zonas): Promise<Zonas> {
    return await this.zonasPort.save(zonas);
  }
  async findAll(estado: boolean): Promise<Zonas[]> {
    return await this.zonasPort.findAll(estado);
  }
}