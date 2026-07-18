import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DespachoEntity } from '../../../adapters/despacho/entities';
@Entity({ name: 'guiadespacho' })
export class GuiaDespachoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DespachoEntity, (despacho) => despacho.guias, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'despacho_id',
  })
  despacho: DespachoEntity;

  @Column({ type: 'int' })
  id_guia: number;

  @Column({ type: 'char', length: 2 })
  estado: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255 })
  userCreated: string;
}
