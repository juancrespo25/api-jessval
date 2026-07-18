import { Zonas } from '../../applications/zonas';

export interface IZonasPort {
  save(zonas: Zonas): Promise<Zonas>;
  findAll(estado: boolean): Promise<Zonas[]>
}