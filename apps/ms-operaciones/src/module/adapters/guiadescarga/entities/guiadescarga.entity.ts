import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guiadescarga' })
export class GuiaDescargaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 2, nullable: false })
  estado!: string;

  @Column({ type: 'int', nullable: false })
  id_guia!: number;

  @Column({ type: 'char', nullable: false })
  tipo!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recibido: string | null;

  @Column({ type: 'char', length: 2, nullable: true })
  parentesco: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  documento: string | null;

  @Column({ type: 'char', length: 2, nullable: true })
  motivo: string | null;

  @Column({ type: 'int', nullable: true })
  puerta: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  colorpuerta: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  suministro: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_descarga: string | null;

  @Column({ type: 'time', nullable: true })
  hora_descarga: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt!: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated!: string;
}
