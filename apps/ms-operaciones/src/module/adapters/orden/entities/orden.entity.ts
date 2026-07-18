import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GuiaEntity } from '../../guia/entities/guia.entity';

@Entity({ name: 'orden' })
export class OrdenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', unique: true, nullable: false })
  numero!: number;

  @Column({ type: 'char', length: 10, nullable: false })
  customer!: string;

  @Column({ type: 'char', length: 10, nullable: false })
  ccosto!: string;

  @OneToMany(() => GuiaEntity, (guia) => guia.orden,{
    cascade: false,
  })
  guias!: GuiaEntity[];

  @Column({ type: 'char', length: 3, nullable: false })
  provincia!: string;

  @Column({ type: 'char', length: 6, nullable: false })
  origen!: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  fecha!: Date;

  @Column({ type: 'timestamp', nullable: false })
  fecha_registro!: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated!: string;

  @Column({ type: 'char', length: 10, nullable: true })
  userUpdated!: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

}
