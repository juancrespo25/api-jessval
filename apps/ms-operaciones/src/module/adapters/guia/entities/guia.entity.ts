import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrdenEntity } from '../../orden/entities/orden.entity';
import { DocAdjuntoEntity } from '../../docadjunto/entities';

@Entity({ name: 'guia' })
export class GuiaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', nullable: false })
  id_guia!: number;

  @Column({ type: 'int', nullable: false })
  item!: number;

  @ManyToOne(() => OrdenEntity, (orden) => orden.guias, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'orden_id',
  })
  orden!: OrdenEntity;

  @Column({ type: 'varchar', length: 200, nullable: true })
  empresa!: string;

  @Column({ type: 'int' })
  destinatario!: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  direccion!: string;

  @Column({ type: 'int' })
  tarifa!: number;

  @Column({ type: 'int', nullable: false })
  peso!: number;

  @Column({ type: 'int', nullable: false })
  bultos!: number;

  @Column({ type: 'int', nullable: false })
  unidades!: number;

  @Column({ type: 'char', length: 6, nullable: false })
  origen!: string;

  @Column({ type: 'char', length: 6, nullable: false })
  destino!: string;

  @Column({ type: 'int' })
  tenvio!: number;

  @Column({ type: 'char', length: 2, nullable: false })
  contenido!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  observaciones!: string;

  @Column({ type: 'char', length: 2, nullable: false })
  estado!: string;

  @Column({ type: 'boolean', nullable: false })
  digitalizado!: boolean;

  @Column({ type: 'varchar', length: 25, nullable: true })
  imagen?: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  imagen2?: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  imagen3?: string;

  @Column({ type: 'date', nullable: true })
  fecha_descarga: string;

  @Column({ type: 'time', nullable: true })
  hora_descarga: string;

  @Column({ type: 'char', length: 1, nullable: true })
  ecuenta?: string;

  @Column({ type: 'char', length: 1, nullable: true })
  dcliente?: string;

  @OneToMany(() => DocAdjuntoEntity, (docadjunto) => docadjunto.id_guia, {
    cascade: false,
  })
  docadjuntos!: DocAdjuntoEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  fecha!: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated!: string;

  @Column({ type: 'char', length: 10, nullable: true })
  userUpdated!: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;
}
