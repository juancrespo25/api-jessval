import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'agente'})
export class AgenteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'char', length: 3})
    provincia: string;

    @Column({type: 'varchar', length: 100})
    descripcion: string;

    @Column({type: 'varchar', length: 150, nullable: true})
    direccion: string;

    @Column({type: 'char', length: 6, nullable: true})
    ubigeo: string;

    @Column({type: 'varchar', length: 50, nullable: true})
    telefono: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    representante: string;

    @Column({type: 'boolean'})
    estado: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'char', length: 10, nullable: true})
    userCreated: string;

    @Column({ type: "char", length: 10,nullable: true })
    userUpdated!: string;

    @Column({ type: "timestamp", nullable: true })
    updatedAt!: Date | null;
}