export type CustomerProps = {
    id?: string;
    descripcion: string;
    codigo: string;
    ruc: string;
    direccion: string;
    ubigeo: string;
    contacto?: string;
    email?: string;
    telefono?: string;
    status?: boolean;
    userCreated?: string;
    createdAt?: Date;
    userUpdated?: string;
    updatedAt?: Date;
}

export class Customer {
    private readonly id?: string;
    private readonly descripcion!: string;
    private readonly codigo!: string;
    private readonly ruc!: string;
    private readonly direccion!: string;
    private readonly ubigeo!: string;
    private readonly contacto?: string;
    private readonly email?: string;
    private readonly telefono?: string;
    private readonly status?: boolean;
    private readonly userCreated?: string;
    private readonly createdAt?: Date;
    private readonly userUpdated?: string;
    private readonly updatedAt?: Date;

    constructor(props: CustomerProps) {
        Object.assign(this, props);
    }

    get properties() {
        return {
            id: this.id,
            descripcion: this.descripcion,
            codigo: this.codigo,
            ruc: this.ruc,
            direccion: this.direccion,
            ubigeo: this.ubigeo,
            contacto: this.contacto,
            email: this.email,
            telefono: this.telefono,
            status: this.status,
            userCreated: this.userCreated,
            createdAt: this.createdAt,
            userUpdated: this.userUpdated,
            updatedAt: this.updatedAt,
        }
    }
}