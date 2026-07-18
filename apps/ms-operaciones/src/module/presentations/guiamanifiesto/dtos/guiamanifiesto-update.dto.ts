import { Type } from "class-transformer";
import { IsDate, IsEmpty, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class GuiaManifiestoUpdateDto{

  @IsNotEmpty()
  @IsNumber()
  id_guia: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  recibido: string;

  @IsOptional()
  @IsString()
  parentesco: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  documento: string;

  @IsOptional()
  @IsString()
  motivo: string;

  @IsOptional()
  @IsNumber()
  colorpuerta: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  suministro: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_descarga: Date;

  @IsOptional()
  @IsMilitaryTime()
  hora_descarga: string;
}