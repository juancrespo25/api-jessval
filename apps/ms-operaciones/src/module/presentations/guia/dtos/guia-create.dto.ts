import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
 
}
