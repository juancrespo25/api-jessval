export type EmpresaTransporteProps = {
  id?: string;
  descripcion?: string;
  direccion?: string;
  ubigeo?: string;
  telefono?: string;
  contacto?: string;
  tipoenvio?: string;
  estado?: boolean;
  createdAt?: Date;
  userCreated?: string;
  userUpdated?: string;
  updatedAt?: Date | null;
}

export class EmpresaTransporte {
  private readonly id?: string;
  private readonly descripcion?: string;
  private readonly direccion?: string;
  private readonly ubigeo?: string;
  private readonly telefono?: string;
  private readonly contacto?: string;
  private readonly tipoenvio?: string;
  private readonly estado?: boolean;
  private readonly createdAt?: Date;
  private readonly userCreated?: string;
  private readonly userUpdated?: string;
  private readonly updatedAt?: Date | null;
  constructor(props: EmpresaTransporteProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      direccion: this.direccion,
      ubigeo: this.ubigeo,
      telefono: this.telefono,
      contacto: this.contacto,
      tipoenvio: this.tipoenvio,
      estado: this.estado,
      createdAt: this.createdAt,
      userCreated: this.userCreated,
      userUpdated: this.userUpdated,
      updatedAt: this.updatedAt,
    };
  }
}