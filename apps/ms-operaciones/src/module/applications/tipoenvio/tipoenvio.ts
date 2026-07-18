export type TipoEnvioProps = {
  id?: number;
  descripcion?: string;
  linea?: number;
  estado?: boolean;
};

export class TipoEnvio {
  private readonly id?: number;
  private readonly descripcion?: string;
  private readonly linea?: number;
  private readonly estado?: boolean;

  constructor(props: TipoEnvioProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      linea: this.linea,
      estado: this.estado,
    };
  }
}
