import { Exclude } from 'class-transformer';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TipoDocumento } from '../../../applications/docadjunto/docadjunto';

class GuiaDocAdjuntoDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(50)
  numero: string;

  @IsInt()
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;
}

export class GuiaCreateDTO {
  @IsNotEmpty()
  @IsNumber()
  id_guia: number;

  @IsOptional()
  @IsString()
  orden: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  ccosto: string;

  @IsNotEmpty()
  @IsNumber()
  item: number;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsNumber()
  destinatario: number;

  @IsString()
  destinatario_name: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsNumber()
  tarifa: number;

  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @IsNotEmpty()
  @IsNumber()
  bultos: number;

  @IsNotEmpty()
  @IsNumber()
  unidades: number;

  @IsNotEmpty()
  @IsString()
  origen: string;

  @IsNotEmpty()
  @IsString()
  destino: string;

  @IsNotEmpty()
  @IsNumber()
  tenvio: number;

  @IsNotEmpty()
  @IsString()
  contenido: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsBoolean()
  digitalizado: boolean;

  @Exclude()
  @IsOptional()
  @IsString()
  imagen: string;

  @Exclude()
  @IsOptional()
  @IsString()
  imagen2: string;

  @Exclude()
  @IsOptional()
  @IsString()
  imagen3: string;

  @Exclude()
  @IsOptional()
  @IsString()
  ecuenta: string;

  @Exclude()
  @IsOptional()
  @IsString()
  dcliente: string;

  @IsOptional()
  @IsString()
  userCreated: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuiaDocAdjuntoDTO)
  docadjuntos?: GuiaDocAdjuntoDTO[];

}
