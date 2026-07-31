import { GuiaDespacho } from '../../applications/guiadespacho';

export interface IGuiaDespachoPort {

  addGuia(guiaDespacho: GuiaDespacho ): Promise<GuiaDespacho>;
}