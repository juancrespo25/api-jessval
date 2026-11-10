import { GuiaDescarga } from '../../applications/guiadescarga';

export interface IGuiaDescargaPort {
  save(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga>;
  getAllType(type: string): Promise<GuiaDescarga[]>;
  getById(id_guia: number): Promise<GuiaDescarga>;
  update(guiaDescarga: GuiaDescarga): Promise<GuiaDescarga>;
}