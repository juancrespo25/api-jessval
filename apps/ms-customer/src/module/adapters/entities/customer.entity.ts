import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer'})
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    descripcion!: string;

    @Column({ type: "char", length: 10, unique: true ,nullable: false })
    codigo!: string;

    @Column({ type: "char", length: 11, unique: true, nullable: false })
    ruc!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    direccion!: string;

    @Column({ type: "char", length: 6, nullable: false })
    ubigeo!: string;

    @Column({ type: "varchar", length: 70, nullable: true })
    contacto!: string;

    @Column({ type: "varchar", length: 70, nullable: true })
    email!: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    telefono!: string;

    @Column({ type: "boolean", nullable: true })
    status!: boolean;

    @Column({ type: "varchar", length: 50, nullable: true })
    user!: string;

    @Column({ type: "varchar", length: 250, nullable: true })
    password!: string;

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