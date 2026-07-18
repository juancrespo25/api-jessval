export type MotivoProps = {
  id?: string;
  descripcion?: string;
  estado?: boolean;
  tipo?: number;
};

export class Motivo {
  private readonly id?: string;
  private readonly descripcion?: string;
  private readonly estado?: boolean;
  private readonly tipo?: number;
  constructor(props: MotivoProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      estado: this.estado,
      tipo: this.tipo,
    };
  }
}