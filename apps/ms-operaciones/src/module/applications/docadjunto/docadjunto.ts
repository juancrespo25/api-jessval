export type DocAdjuntoProps = {
  id?: string;
  id_guia?: string;
  numero?: string;
  tipo?: number;
}

export class DocAdjunto {
  private readonly id?: string
  private readonly id_guia?: string
  private readonly numero?: string
  private readonly tipo?: number

  constructor(props: DocAdjuntoProps) {
    Object.assign(this, props);
  }

  properties() {
    return {
      id: this.id,
      id_guia: this.id_guia,
      numero: this.numero,
      tipo: this.tipo
    }
  }
}