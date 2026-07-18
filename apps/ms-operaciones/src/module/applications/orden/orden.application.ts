import { IOrdenPort } from '../../ports/orden';
import { Orden } from './orden';

export class OrdenApplication implements IOrdenPort {
  constructor(private readonly orderPort: IOrdenPort) {}

  async findById(numero: number): Promise<Orden | null> {
    return await this.orderPort.findById(numero);
  }

  async save(orden: Orden): Promise<Orden> {
    return await this.orderPort.save(orden);
  }

  async getOrdenToday(): Promise<Orden[]> {
    return await this.orderPort.getOrdenToday();
  }
}
