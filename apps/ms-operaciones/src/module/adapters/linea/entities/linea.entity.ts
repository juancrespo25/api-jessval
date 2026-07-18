import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'linea'})
export class LineaEntity {

  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 25})
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}