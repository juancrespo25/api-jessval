import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'movimiento'})
export class MovimientoEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  id_guia!: number;

  @Column({ type: "varchar", length: 100, nullable: false})
  modulo: string;

  @Column({ type: "varchar", length: 100, nullable: false})
  detalle: string;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date | null;
  
}