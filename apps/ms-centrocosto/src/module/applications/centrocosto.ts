export type CentroCostoProps = {
  id?: string;
  descripcion?: string;
  codigo?: string;
  cliente?: string;
  status?: boolean;
  contacto?: string;
  email?: string;
  telefono?: string;
  userCreated?: string;
  createdAt?: Date;
  userUpdated?: string;
  updatedAt?: Date | null;
  userInactive?: string;
  inactiveAt?: Date | null;
};
export class CentroCosto {
    private readonly id?: string;
    private readonly descripcion!: string;
    private readonly codigo!: string;
    private readonly cliente!: string;
    private readonly status?: boolean;
    private readonly contacto?: string;
    private readonly email?: string;
    private readonly telefono?: string;
    private readonly userCreated?: string;
    private readonly createdAt?: Date;
    private readonly userUpdated?: string;
    private readonly updatedAt?: Date | null;
    private readonly userInactive?: string;
    private readonly inactiveAt?: Date | null;

    constructor(props: CentroCostoProps) {
    Object.assign(this, props);
}

    get properties() {
        return {
        id: this.id,
        descripcion: this.descripcion,
        codigo: this.codigo,
        cliente: this.cliente,
        status: this.status,
        contacto: this.contacto,
        email: this.email,
        telefono: this.telefono,
        userCreated: this.userCreated,
        createdAt: this.createdAt,
        userUpdated: this.userUpdated,
        updatedAt: this.updatedAt,
        userInactive: this.userInactive,
        inactiveAt: this.inactiveAt,
        };
    }
    }
