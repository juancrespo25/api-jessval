import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ManifiestoEntity } from '../../manifiesto/entities/manifiesto.entity';

@Entity({ name: 'guiamanifiesto' })
export class GuiaManifiestoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ManifiestoEntity, (manifiesto) => manifiesto.guias, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
  name: 'manifiesto_id',
})
  manifiesto!: ManifiestoEntity;

  @Column({ type: 'int', nullable: false })
  id_guia: number;

  @Column({ type: 'int', nullable: false })
  ordenamiento: number;

  @Column({ type: 'char', length: 2, nullable: false })
  estado: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recibido: string | null;

  @Column({ type: 'char', length: 2, nullable: true })
  parentesco: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  documento: string | null;

  @Column({ type: 'char', length: 2, nullable: true })
  motivo: string | null;

  @Column({ type: 'int', nullable: true })
  colorpuerta: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  suministro: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_descarga: string | null;

  @Column({ type: 'time', nullable: true })
  hora_descarga: string | null;
}
