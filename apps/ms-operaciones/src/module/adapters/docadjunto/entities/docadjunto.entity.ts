import { Column, OneToMany, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { GuiaEntity } from "../../guia/entities";

enum TipoDocumento {
  FACTURA = 1,
  BOLETA = 2,
  GUIA_DE_REMISION = 3,
  GUIA = 4,
  ORDEN_DE_SERVICIO = 5,
}

@Entity({ name: 'docadjunto' })
export class DocAdjuntoEntity {

  @PrimaryGeneratedColumn()
  id: string;

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