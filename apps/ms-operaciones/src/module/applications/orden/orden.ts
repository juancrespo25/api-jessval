import type { GuiaProps } from '../guia/guia';

export type OrdenProps = {
  id?: string;
  numero: number;
  customer?: string;
  customerDescripcion?: string;
  ccosto?: string;
  ccostoDescripcion?: string;
  provincia?: string;
  provinciaDescripcion?: string;
  origen?: string;
  ubigeoDistrito?: string;
  fecha?: Date;
  fecha_registro?: Date;
  userCreated?: string;
  userNombre?: string;
  userUpdated?: string;
  updatedAt?: Date;
  guias?: GuiaProps[];
  maxItem?: number | null;
  guiaCount?: number;
};

export class Orden {
  private readonly id?: string;
  private readonly numero!: number;
  private readonly customer!: string;
  private readonly customerDescripcion?: string;
  private readonly ccosto!: string;
  private readonly ccostoDescripcion?: string;
  private readonly provincia!: string;
  private readonly provinciaDescripcion?: string;
  private readonly origen!: string;
  private readonly ubigeoDistrito?: string;
  private readonly fecha?: Date;
  private readonly fecha_registro!: Date;
  private readonly userCreated!: string;
  private readonly userNombre?: string;
  private readonly userUpdated?: string;
  private readonly updatedAt?: Date;
  private readonly guias?: GuiaProps[];
  private readonly maxItem?: number | null;
  private readonly guiaCount?: number;
  constructor(props: OrdenProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      numero: this.numero,
      customer: this.customer,
      customerDescripcion: this.customerDescripcion,
      ccosto: this.ccosto,
      ccostoDescripcion: this.ccostoDescripcion,
      provincia: this.provincia,
      provinciaDescripcion: this.provinciaDescripcion,
      origen: this.origen,
      ubigeoDistrito: this.ubigeoDistrito,
      fecha: this.fecha,
      fecha_registro: this.fecha_registro,
      userCreated: this.userCreated,
      userNombre: this.userNombre,
      userUpdated: this.userUpdated,
      updatedAt: this.updatedAt,
      guias: this.guias,
      maxItem: this.maxItem,
      guiaCount: this.guiaCount,
    };
  }
}
