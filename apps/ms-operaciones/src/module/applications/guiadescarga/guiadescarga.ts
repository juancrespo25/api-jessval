export type GuiaDescargaProps = {
  id?: string;
  id_guia?: number;
  estado?: string;
  tipo?: string;
  recibido?: string | null;
  parentesco?: string | null;
  documento?: string | null;
  motivo?: string | null;
  puerta?: number | null;
  colorpuerta?: string | null;
  suministro?: string | null;
  fecha_descarga?: string | null;
  hora_descarga?: string | null;
  createdAt?: Date;
  userCreated?: string | null;
  item?: number | string | null;
  guia_estado?: string | null;
  orden?: string | number | null;
  cliente?: string | null;
  centrocosto?: string | null;
  destino?: string | null;
  usuario?: string | null;
};

export class GuiaDescarga {
  private readonly id!: string;
  private readonly id_guia!: number;
  private readonly estado!: string;
  private readonly tipo!: string;
  private readonly recibido!: string | null;
  private readonly parentesco!: string | null;
  private readonly documento!: string | null;
  private readonly motivo!: string | null;
  private readonly puerta!: number | null;
  private readonly colorpuerta!: string | null;
  private readonly suministro!: string | null;
  private readonly fecha_descarga!: string | null;
  private readonly hora_descarga!: string | null;
  private readonly createdAt!: Date;
  private readonly userCreated!: string | null;
  private readonly item!: number | string | null;
  private readonly guia_estado!: string | null;
  private readonly orden!: string | number | null;
  private readonly cliente!: string | null;
  private readonly centrocosto!: string | null;
  private readonly destino!: string | null;
  private readonly usuario!: string | null;

  constructor(props: GuiaDescargaProps) {
    Object.assign(this, props);
  }

  properties() {
    return {
      id: this.id,
      id_guia: this.id_guia,
      estado: this.estado,
      tipo: this.tipo,
      recibido: this.recibido,
      parentesco: this.parentesco,
      documento: this.documento,
      motivo: this.motivo,
      puerta: this.puerta,
      colorpuerta: this.colorpuerta,
      suministro: this.suministro,
      fecha_descarga: this.fecha_descarga,
      hora_descarga: this.hora_descarga,
      createdAt: this.createdAt,
      userCreated: this.userCreated,
      item: this.item,
      guia_estado: this.guia_estado,
      orden: this.orden,
      cliente: this.cliente,
      centrocosto: this.centrocosto,
      destino: this.destino,
      usuario: this.usuario,
    };
  }
}