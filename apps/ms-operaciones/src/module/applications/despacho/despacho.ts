import { GuiaDespachoProps } from "../guiadespacho";

export type DespachoProps = {
  id?: number;
  guias?: GuiaDespachoProps[];
  agente?: number;
  agente_descripcion?: string;
  tipoenvio?: number;
  tipoenvio_descripcion?: string;
  empresatransporte?: string;
  empresatransporte_descripcion?: string;
  estado?: string;
  status?: boolean;
  fecha_creacion?: Date | null;
  createdAt?: Date;
  userCreated?: string;
  userUpdated?: string;
  updatedAt?: Date | null;
  userAdmit?: string;
  admittedAt?: Date | null;
  agente_name?: string;
  etransporte?: string;
  tenvio_name?: string;
  provincia?: string;
}

export class Despacho {
  
  private readonly id?: number;
  private readonly guias?: GuiaDespachoProps[];
  private readonly agente?: number;
  private readonly agente_descripcion?: string;
  private readonly tipoenvio?: number;
  private readonly tipoenvio_descripcion?: string;
  private readonly empresatransporte?: string;
  private readonly empresatransporte_descripcion?: string;
  private readonly estado?: string;
  private readonly status?: boolean;
  private readonly fecha_creacion?: Date | null;
  private readonly createdAt?: Date;
  private readonly userCreated?: string;
  private readonly userUpdated?: string;
  private readonly updatedAt?: Date | null;
  private readonly userAdmit?: string;
  private readonly admittedAt?: Date | null;
  private readonly agente_name?: string;
  private readonly etransporte?: string;
  private readonly tenvio_name?: string;
  private readonly provincia?: string;

  constructor(props: DespachoProps){
    Object.assign(this, props);
  }

  get Properties() {
    return {
      id: this.id,
      guias: this.guias,
      agente: this.agente,
      agente_descripcion: this.agente_descripcion,
      tipoenvio: this.tipoenvio,
      tipoenvio_descripcion: this.tipoenvio_descripcion,
      empresatransporte: this.empresatransporte,
      empresatransporte_descripcion: this.empresatransporte_descripcion,
      estado: this.estado,
      status: this.status,
      fecha_creacion: this.fecha_creacion,
      createdAt: this.createdAt,
      userCreated: this.userCreated,
      userUpdated: this.userUpdated,
      updatedAt: this.updatedAt,
      userAdmit: this.userAdmit,
      admittedAt: this.admittedAt,
      agente_name: this.agente_name,
      etransporte: this.etransporte,
      tenvio_name: this.tenvio_name,
      provincia: this.provincia
    }
  }

}