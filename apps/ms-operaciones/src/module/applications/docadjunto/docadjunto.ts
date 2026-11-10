export enum TipoDocumento {
  FACTURA = 1,
  BOLETA = 2,
  GUIA_DE_REMISION = 3,
  GUIA = 4,
  ORDEN_DE_SERVICIO = 5,
}

export type DocAdjuntoProps = {
  id?: number;
  id_guia: string;
  numero: string;
  tipo: TipoDocumento;
};

export class DocAdjunto {
  private readonly id?: number;
  private readonly id_guia!: string;
  private readonly numero!: string;
  private readonly tipo!: TipoDocumento;

  constructor(props: DocAdjuntoProps) {
    Object.assign(this, props);
  }

  properties(): DocAdjuntoProps {
    return {
      id: this.id,
      id_guia: this.id_guia,
      numero: this.numero,
      tipo: this.tipo
    };
  }
}

export class GuiaNoEncontradaError extends Error {
  constructor(idGuia: string) {
    super(`Guía con id ${idGuia} no encontrada`);
    this.name = 'GuiaNoEncontradaError';
  }
}