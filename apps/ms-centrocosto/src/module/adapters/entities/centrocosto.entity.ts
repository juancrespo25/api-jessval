import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'centrocosto'})
export class CentroCostoEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    descripcion!: string;

    @Column({ type: "char", length: 10, unique: true ,nullable: false })
    codigo!: string;

    @Column({ type: "char", length: 10, nullable: false})
    cliente!: string;

    @Column({ type: "boolean", nullable: true })
    status!: boolean;

    @Column({ type: "varchar", length: 70, nullable: true })
    contacto!: string;

    @Column({ type: "varchar", length: 70, nullable: true })
    email!: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    telefono!: string;

    @Column({ type: "char", length: 10, nullable: true })
    userCreated!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "char", length: 10,nullable: true })
    userUpdated!: string;

    @Column({ type: "timestamp", nullable: true })
    updatedAt!: Date | null;

    @Column({ type: "char", length: 10, nullable: true })
    userInactive!: string;

    @Column({ type: "timestamp", nullable: true })
    inactiveAt!: Date | null;

}