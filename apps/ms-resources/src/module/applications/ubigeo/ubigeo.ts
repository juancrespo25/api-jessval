export type UbigeoProps = {
    id?: string;
    codigo: string;
    departamento: string;
    provincia: string;
    distrito: string;
}

export class Ubigeo {
    private readonly id?: string;
    private readonly codigo!: string;
    private readonly departamento!: string;
    private readonly provincia!: string;
    private readonly distrito!: string;

    constructor(props: UbigeoProps) {
        Object.assign(this, props);
    }

    get properties(){
        return {
            id: this.id,
            codigo: this.codigo,
            departamento: this.departamento,
            provincia: this.provincia,
            distrito: this.distrito
        }
    }
}