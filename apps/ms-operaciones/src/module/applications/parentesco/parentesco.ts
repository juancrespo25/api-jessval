export type ParentescoProps = {
  id: string;
  descripcion: string;
  estado?: boolean;
};

export class Parentesco {
  private readonly id: string;
  private readonly descripcion: string;
  private readonly estado?: boolean;

  constructor(props: ParentescoProps) {
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