import { TipoEnvio } from '../../applications/tipoenvio';

export interface ITipoEnvioPort {
  findAll(estado?: boolean, linea?: number): Promise<TipoEnvio[]>;

  save(tipoEnvio: TipoEnvio): Promise<TipoEnvio>;
}
