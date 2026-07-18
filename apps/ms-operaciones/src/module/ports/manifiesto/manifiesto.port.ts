import { Manifiesto } from '../../applications/manifiesto';

export interface IManifiestoPort {
  save(manifiesto: Manifiesto): Promise<Manifiesto>;
  update(manifiesto: Manifiesto): Promise<Manifiesto>;
  findAll(fecha_inicial: Date, fecha_final: Date, codigo: string, estado: string, courier: string, zona: string): Promise<Manifiesto[]>
  findByCodigo(codigo: string): Promise<Manifiesto | null>;
}