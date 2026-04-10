export type CustomerProps = {
    descripcion: string;
    codigo: string;
    ruc: string;
    direccion: string;
    ubigeo: string;
    contacto?: string;
    email?: string;
    telefono?: string;
    activo?: boolean;
    userCreated?: string;
    createdAt?: Date;
    userUpdated?: string;
}

export class Customer {
    private readonly descripcion!: string;
    private readonly codigo!: string;
    private readonly ruc!: string;
    private readonly direccion!: string;
    private readonly ubigeo!: string;
    private readonly contacto?: string;
    private readonly email?: string;
    private readonly telefono?: string;
    private readonly activo?: boolean;
    private readonly userCreated?: string;
    private readonly createdAt?: Date;
    private readonly userUpdated?: string;


    constructor(props: CustomerProps) {
        Object.assign(this, props);
    }

    get properties() {
        return {
            descripcion: this.descripcion,
            codigo: this.codigo,
            ruc: this.ruc,
            direccion: this.direccion,
            ubigeo: this.ubigeo,
            contacto: this.contacto,
            email: this.email,
            telefono: this.telefono,
            activo: this.activo,
            userCreated: this.userCreated,
            createdAt: this.createdAt,
            userUpdated: this.userUpdated,
        }
    }
}