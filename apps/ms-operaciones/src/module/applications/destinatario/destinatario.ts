export type DestinatarioProps = {
  id?: number;
  nombres: string;
  cliente: string;
  ccosto: string;
  ubigeo: string;
  direccion: string;
}

export class Destinatario {
  private readonly id?: number;
  private readonly nombres!: string;
  private readonly cliente!: string;
  private readonly ccosto!: string;
  private readonly ubigeo!: string;
  private readonly direccion!: string;

  constructor(props: DestinatarioProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      nombres: this.nombres,
      cliente: this.cliente,
      ccosto: this.ccosto,
      ubigeo: this.ubigeo,
      direccion: this.direccion
    }
  }
}