import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GuiaManifiestoEntity } from '../../guiamanifiesto/entities';

@Entity({ name: 'manifiesto' })
export class ManifiestoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  codigo: string;

  @OneToMany(() => GuiaManifiestoEntity, (guiamanifiesto) => guiamanifiesto.manifiesto,{
      cascade: false,
    })
    guias!: GuiaManifiestoEntity[];

  @Column({ type: 'char', length: 6, nullable: false })
  zona: string;

  @Column({ type: 'char', length: 10, nullable: false })
  courier: string;

  @Column({ type: 'char', length: 2, nullable: false })
  estado: string;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  userUpdated!: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;
}
