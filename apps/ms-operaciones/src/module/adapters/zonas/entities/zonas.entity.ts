import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'zonas'})
export class ZonasEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 6, unique: true, nullable: false })
  codigo: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  descripcion: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  estado: boolean;
}