export type GuiaManifiestoProps = {
  id_guia: number;
  ordenamiento?: number;
  estado: string;
  recibido?: string;
  parentesco?: string;
  documento?: string;
  motivo?: string;
  colorpuerta?: number;
  suministro?: string;
  fecha_descarga?: Date;
  hora_descarga?: string;
  observaciones?: string;
  provincia?: string;
  manifiesto?: string;
};

export class GuiaManifiesto {
  private readonly id_guia!: number;
  private readonly ordenamiento!: number;
  private readonly estado!: string;
  private readonly recibido!: string;
  private readonly parentesco!: string;
  private readonly documento!: string;
  private readonly motivo!: string;
  private readonly colorpuerta!: number;
  private readonly suministro!: string;
  private readonly fecha_descarga!: Date;
  private readonly hora_descarga!: string;
  private readonly observaciones!: string;

  constructor(props: GuiaManifiestoProps) {
    Object.assign(this, props);
  }

  properties() {
    return {
      id_guia: this.id_guia,
      ordenamiento: this.ordenamiento,
      estado: this.estado,
      recibido: this.recibido,
      parentesco: this.parentesco,
      documento: this.documento,
      motivo: this.motivo,
      colorpuerta: this.colorpuerta,
      suministro: this.suministro,
      fecha_descarga: this.fecha_descarga,
      hora_descarga: this.hora_descarga,
      observaciones: this.observaciones,
    };
  }
}
