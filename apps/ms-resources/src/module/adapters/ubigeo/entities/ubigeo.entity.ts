import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'ubigeo'})
export class UbigeoEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: "char", length: 10, unique: true ,nullable: false })
    codigo!: string;

    @Column({ type: "varchar", length: 100, nullable: false})
    departamento: string;

    @Column({ type: "varchar", length: 100, nullable: false})
    provincia: string;

    @Column({ type: "varchar", length: 100, nullable: false})
    distrito: string;

    @Column({ type: "char", length: 3, nullable: true })
    codprovincia: string;

}