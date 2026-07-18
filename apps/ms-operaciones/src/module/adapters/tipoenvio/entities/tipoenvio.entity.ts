import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'tipoenvio'})
export class TipoEnvioEntity {

  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 25 })
  descripcion: string;

  @Column({ type: 'int'})
  linea: number

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
