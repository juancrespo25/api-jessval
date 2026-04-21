export type UserProps = {
    id?: string;
    codigo: string;
    nombres: string;
    apellidos: string;
    email?: string;
    telefono?: string;
    status?: boolean;
    area?: string;
    user_name?: string;
    password?: string;
    userCreated?: string;
    createdAt?: Date;
    userUpdated?: string;
}

export class User {
    private readonly id?: string;
    private readonly codigo!: string;
    private readonly nombres!: string;
    private readonly apellidos!: string;
    private readonly email?: string;
    private readonly telefono?: string;
    private readonly status?: boolean;
    private readonly area?: string;
    private readonly user_name?: string;
    private readonly password?: string;
    private readonly userCreated?: string;
    private readonly createdAt?: Date;
    private readonly userUpdated?: string;
    constructor(props: UserProps) {
        Object.assign(this, props);
    }

    get properties() {
        return {
            id: this.id,
            codigo: this.codigo,
            nombres: this.nombres,
            apellidos: this.apellidos,
            email: this.email,
            telefono: this.telefono,
            status: this.status,
            area: this.area,
            user_name: this.user_name,
            password: this.password,
            userCreated: this.userCreated,
            createdAt: this.createdAt,
            userUpdated: this.userUpdated
        }
    }
}