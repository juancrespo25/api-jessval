import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'destinatario' })
export class DestinatarioEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  nombres: string;

  @Column({ type: "char", length: 10, nullable: false })
  cliente: string;

  @Column({ type: "char", length: 10, nullable: false })
  ccosto: string;


  @Column({ type: "char", length: 6, nullable: false })
  ubigeo: string;

  @Column({ type: "varchar", length: 300, nullable: false })
  direccion: string;
}
