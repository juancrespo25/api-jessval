import { GuiaManifiestoProps } from '../guiamanifiesto/guiamanifiesto';

export type ManifiestoProps = {
  codigo: string;
  guias?: GuiaManifiestoProps[];
  zona?: string;
  zona_name?: string;
  courier?: string;
  nombre_courier?: string;
  estado?: string;
  userCreated?: string;
  userUpdated?: string;
  createdAt?: Date;
  updatedAt?: Date;
  total?: number;
  total_pendientes?: number;
  total_entregados?: number;
  total_motivados?: number;
  total_retorno?: number;
};

export class Manifiesto {
  private readonly codigo!: string;
  private readonly guias?: GuiaManifiestoProps[];
  private readonly zona?: string;
  private readonly courier?: string;
  private readonly nombre_courier?: string;
  private readonly estado!: string;
  private readonly userCreated?: string;
  private readonly userUpdated?: string;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;
  private readonly total?: number;
  private readonly total_pendientes?: number;
  private readonly total_entregados?: number;
  private readonly total_motivados?: number;
  private readonly total_retorno?: number;
  constructor(props: ManifiestoProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      codigo: this.codigo,
      guias: this.guias,
      zona: this.zona,
      courier: this.courier,
      nombre_courier: this.nombre_courier,
      estado: this.estado,
      userCreated: this.userCreated,
      userUpdated: this.userUpdated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      total: this.total,
      total_pendientes: this.total_pendientes,
      total_entregados: this.total_entregados,
      total_motivados: this.total_motivados,
      total_retorno: this.total_retorno,
    };
  }
}
