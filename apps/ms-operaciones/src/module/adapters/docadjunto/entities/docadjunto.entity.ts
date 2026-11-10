import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { GuiaEntity } from "../../guia/entities";
import { TipoDocumento } from '../../../applications/docadjunto/docadjunto';

@Entity({ name: 'docadjunto' })
export class DocAdjuntoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GuiaEntity, (guia) => guia.docadjuntos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  id_guia: GuiaEntity;

  @Column({ type: 'varchar', length: 50, nullable: false })
  numero: string;

  @Column({ type: 'int',  nullable: false })
  tipo: TipoDocumento;
}