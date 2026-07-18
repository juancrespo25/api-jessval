import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'provincia'})
export class ProvinciaEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "char", length: 3, unique: true ,nullable: false })
  codigo!: string;

  @Column({ type: "varchar", length: 100 ,nullable: false })
  descripcion!: string;

  @Column({ type: "char", length: 3, nullable: true })
  sigla!: string;

  @Column({ type: "char", length: 1, nullable: true })
  status!: string;

  @Column({ type: "char", length: 1, nullable: true })
  tipo!: string;

  @Column({ type: "char", length: 1, nullable: true })
  rendicion!: string;

  @Column({ type: "char", length: 1, nullable: true })
  liquidacion!: string;

}