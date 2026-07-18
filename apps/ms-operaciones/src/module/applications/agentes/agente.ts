export type AgenteProps = {
  id?: number;
  provincia?: string;
  descripcion?: string;
  provincia_agente?: string;
  direccion?: string;
  ubigeo?: string;
  telefono?: string;
  representante?: string;
  estado?: boolean;
  createdAt?: Date;
  userCreated?: string;
  userUpdated?: string;
  updatedAt?: Date | null;
}

export class Agente {
  private readonly id?: number;
  private readonly provincia?: string;
  private readonly descripcion?: string;
  private readonly provincia_agente?: string;
  private readonly direccion?: string;
  private readonly ubigeo?: string;
  private readonly telefono?: string;
  private readonly representante?: string;
  private readonly estado?: boolean;
  private readonly createdAt?: Date;
  private readonly userCreated?: string;
  private readonly userUpdated?: string;
  private readonly updatedAt?: Date | null;
  constructor(props: AgenteProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      provincia: this.provincia,
      descripcion: this.descripcion,
      direccion: this.direccion,
      ubigeo: this.ubigeo,
      telefono: this.telefono,
      representante: this.representante,
      estado: this.estado,
      createdAt: this.createdAt,
      userCreated: this.userCreated,
      userUpdated: this.userUpdated,
      updatedAt: this.updatedAt,
    };
  }
}