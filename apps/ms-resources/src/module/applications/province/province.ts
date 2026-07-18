export type ProvinceProps = {
    id?: string;
    codigo: string;
    descripcion: string;
    sigla: string;
    status: string;
    tipo: string;
    rendicion: string;
    liquidacion: string;
}

export class Province {
    private readonly id?: string
    private readonly codigo!: string;
    private readonly descripcion!: string
    private readonly sigla!: string;
    private readonly status!: string;
    private readonly tipo!: string;
    private readonly rendicion!: string;
    private readonly liquidacion!: string;

    constructor(props: ProvinceProps) {
        Object.assign(this, props);
    }

    get properties() {
        return {
            id: this.id,
            codigo: this.codigo,
            descripcion: this.descripcion,
            sigla: this.sigla,
            status: this.status,
            tipo: this.tipo,
            rendicion: this.rendicion,
            liquidacion: this.liquidacion
        }
    }
  }