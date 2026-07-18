export type ZonasProps = {
  id?: string;
  codigo: string;
  descripcion: string;
  estado: boolean;
};

export class Zonas {
  private readonly id!: string;
  private readonly codigo!: string;
  private readonly descripcion!: string;
  private readonly estado!: boolean;

  constructor(props: ZonasProps) {
    Object.assign(this, props);
  }

  properties() {
    return {
      id: this.id,
      codigo: this.codigo,
      descripcion: this.descripcion,
      estado: this.estado,
    };
  }
}
