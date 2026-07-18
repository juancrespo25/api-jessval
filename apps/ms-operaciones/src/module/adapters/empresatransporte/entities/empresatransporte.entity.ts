import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'empresa_transporte' })
export class EmpresaTransporteEntity {
  @PrimaryColumn({ type: 'char', length: 11})
  id: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'varchar', length: 150, nullable: true  })
  direccion: string;

  @Column({ type: 'char', length: 6, nullable: true })
  ubigeo: string;

  @Column({ type: 'varchar', length: 50, nullable: true  })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true  })
  contacto: string;

  @Column({ type: 'int' })
  tipoenvio: number;

  @Column({ type: 'boolean' })
  estado: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  userCreated: string;

  @Column({ type: 'char', length: 10, nullable: true })
  userUpdated!: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;
}
