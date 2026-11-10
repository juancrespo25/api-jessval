export type GuiaDespachoProps = {
  id?: number;
  id_guia?: number;
  despacho?: number;
  estado?: string;
  userCreated?: string;
  createdAt?: Date;
  provincia?: string;
  destino?: string;
  dnombres?: string;
};

export class GuiaDespacho {
  private readonly id!: number;
  private readonly id_guia!: number;
  private readonly despacho!: number;
  private readonly estado!: string;
  private readonly userCreated!: string;
  private readonly createdAt!: Date;
  private readonly provincia!: string;
  private readonly destino!: string;
  private readonly dnombres!: string;

  constructor(props: GuiaDespachoProps){
    Object.assign(this, props)
  }

  properties(){
    return {
      id: this.id,
      id_guia: this.id_guia,
      despacho: this.despacho,
      estado: this.estado,
      userCreated: this.userCreated,
      createdAt: this.createdAt,
      provincia: this.provincia,
      destino: this.destino,
      dnombres: this.dnombres
    }
  }
}
