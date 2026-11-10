import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { TipoDocumento } from '../../../applications/docadjunto/docadjunto';

export class DocAdjuntoCreateDTO {
  @IsUUID()
  id_guia: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(50)
  numero: string;

  @IsInt()
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;
}
