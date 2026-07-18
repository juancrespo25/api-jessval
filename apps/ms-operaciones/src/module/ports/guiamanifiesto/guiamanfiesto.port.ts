import { GuiaManifiesto } from '../../applications/guiamanifiesto';

export interface IGuiaManifiestoPort {
  validateGuia(id_guia: number): Promise<GuiaManifiesto | null>;
  updateGuiaManifiesto(guiaManifiesto: GuiaManifiesto): Promise<GuiaManifiesto | null>;
}