export type ContenidoProps = {
  id?: string;
  descripcion?: string;
  estado?: boolean;
};

export class Contenido {
  private readonly id?: string;
  private readonly descripcion?: string;
  private readonly estado?: boolean;

  constructor(props: ContenidoProps) {
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
