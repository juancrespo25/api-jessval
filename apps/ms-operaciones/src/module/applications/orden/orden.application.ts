import { FiltrosQueryOrden, GuiaImpresion, IOrdenPort, OrdenDetalle, ResultadoQueryOrden } from '../../ports/orden';
import { Orden } from './orden';

export class OrdenApplication implements IOrdenPort {
  constructor(private readonly orderPort: IOrdenPort) {}

  async findById(numero: number): Promise<Orden | null> {
    return await this.orderPort.findById(numero);
  }

  async getOrdenByCode(numero: number): Promise<OrdenDetalle | null> {
    return await this.orderPort.getOrdenByCode(numero);
  }

  async queryOrden(filtros: FiltrosQueryOrden): Promise<ResultadoQueryOrden[]> {
    return await this.orderPort.queryOrden(filtros);
  }

  async save(orden: Orden): Promise<Orden> {
    return await this.orderPort.save(orden);
  }

  async getOrdenToday(): Promise<Orden[]> {
    return await this.orderPort.getOrdenToday();
  }

  async getGuiasImpresion(numero: number, itemDesde?: number, itemHasta?: number): Promise<GuiaImpresion[]> {
    return await this.orderPort.getGuiasImpresion(numero, itemDesde, itemHasta);
  }
}
