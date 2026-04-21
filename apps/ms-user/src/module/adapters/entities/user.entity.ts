import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user'})
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: "char", length: 10, unique: true ,nullable: false })
    codigo!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombres!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    apellidos!: string;

    @Column({ type: "varchar", length: 70, nullable: true })
    email!: string;

    @Column({ type: "varchar", length: 30, nullable: true })
    telefono!: string;

    @Column({ type: "boolean", nullable: true })
    status!: boolean;

    @Column({ type: "char", length: 10, nullable: true })
    area!: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    user_name!: string;

    @Column({ type: "varchar", length: 200, nullable: true })
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