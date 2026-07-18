import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'contenido'})
export class ContenidoEntity {
  @PrimaryColumn({ type: 'char', length: 2 })
  id: string;

  @Column({ type: 'varchar', length: 30 })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

}
