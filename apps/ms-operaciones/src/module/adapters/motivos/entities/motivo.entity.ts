import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({name: 'motivos'})
export class MotivoEntity {
  @PrimaryColumn({ type: 'char', length: 2 })
  id: string;

  @Column({type: 'varchar', length: 50})
  descripcion: string;

  @Column({type: 'boolean'})
  estado: boolean;

  @Column({type: 'int'})
  tipo: number;
  
}