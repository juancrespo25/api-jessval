export type LineaProps = {
  id?: number;
  descripcion?: string;
  estado?: boolean;
};

export class Linea {
  private readonly id?: number;
  private readonly descripcion?: string;
  private readonly estado?: boolean;

  constructor(props: LineaProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      estado: this.estado,
    };
  }
}
