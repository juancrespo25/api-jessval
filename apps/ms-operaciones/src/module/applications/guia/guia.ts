export type GuiaProps = {
  id?: string;
  id_guia?: number;
  item?: number;
  orden?: string;
  empresa?: string;
  destinatario?: number;
  destinatario_name?: string;
  direccion?: string;
  tarifa?: number;
  peso?: number;
  bultos?: number;
  unidades?: number;
  origen?: string;
  destino?: string;
  tenvio?: number;
  contenido?: string;
  observaciones?: string;
  estado?: string;
  digitalizado?: boolean;
  imagen?: string;
  imagen2?: string;
  imagen3?: string;
  ecuenta?: string;
  dcliente?: string;
  fecha?: Date;
  userCreated?: string;
  userUpdated?: string;
  updatedAt?: Date;
  customer?:String;
  ccosto?:String;
  provincia?:String;
};

export class Guia {
  private readonly id?: string;
  private readonly id_guia!: number;
  private readonly item!: number;
  private readonly orden!: string;
  private readonly empresa?: string;
  private readonly destinatario!: number;
  private readonly destinatario_name!: string;
  private readonly direccion!: string;
  private readonly tarifa!: number;
  private readonly peso!: number;
  private readonly bultos!: number;
  private readonly unidades!: number;
  private readonly origen!: string;
  private readonly destino!: string;
  private readonly tenvio!: number;
  private readonly contenido!: string;
  private readonly observaciones?: string;
  private readonly estado!: string;
  private readonly digitalizado!: boolean;
  private readonly imagen?: string;
  private readonly imagen2?: string;
  private readonly imagen3?: string;
  private readonly ecuenta?: string;
  private readonly dcliente?: string;
  private readonly fecha?: Date;
  private readonly userCreated?: string;
  private readonly userUpdated?: string;
  private readonly updatedAt?: Date;
  private readonly customer?:String;
  private readonly ccosto?:String;

  constructor(props: GuiaProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      id_guia: this.id_guia,
      item: this.item,
      orden: this.orden,
      empresa: this.empresa,
      destinatario: this.destinatario,
      destinatario_name: this.destinatario_name,
      direccion: this.direccion,
      tarifa: this.tarifa,
      peso: this.peso,
      bultos: this.bultos,
      unidades: this.unidades,
      origen: this.origen,
      destino: this.destino,
      tenvio: this.tenvio,
      contenido: this.contenido,
      observaciones: this.observaciones,
      estado: this.estado,
      digitalizado: this.digitalizado,
      imagen: this.imagen,
      imagen2: this.imagen2,
      imagen3: this.imagen3,
      ecuenta: this.ecuenta,
      dcliente: this.dcliente,
      fecha: this.fecha,
      userCreated: this.userCreated,
      userUpdated: this.userUpdated,
      updatedAt: this.updatedAt,
      customer: this.customer,
      ccosto: this.ccosto
    };
  }
}
