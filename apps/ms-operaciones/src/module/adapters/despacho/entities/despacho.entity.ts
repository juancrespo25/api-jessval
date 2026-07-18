import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GuiaDespachoEntity } from '../../../adapters/guiadespacho/entities';

@Entity({name: 'despacho'})
export class DespachoEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => GuiaDespachoEntity, (guiadespacho) => guiadespacho.despacho, {
        cascade: true,
      })
    guias!: GuiaDespachoEntity[];

    @Column({ type: 'int', nullable: false })
    agente: number;

    @Column({ type: 'int', nullable: false })
    tipoenvio: number;

    @Column({ type: 'char', length: 11, nullable: false })
    empresatransporte: string;

    @Column({ type: 'char', length: 2, nullable: false })
    estado: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @Column({ type: 'timestamp', nullable: true })
    fecha_creacion!: Date | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'char', length: 10, nullable: true })
    userCreated: string;

    @Column({ type: 'char', length: 10, nullable: true })
    userUpdated!: string;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt!: Date | null;

    @Column({ type: 'char', length: 10, nullable: true })
    userAdmit!: string;

    @Column({ type: 'timestamp', nullable: true })
    admittedAt!: Date | null;
}