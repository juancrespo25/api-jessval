import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ManifiestoSearchDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_inicial: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_final: Date;

  @IsString()
  @IsOptional()
  codigo: string;

  @IsString()
  @IsOptional()
  estado: string;

  @IsString()
  @IsOptional()
  courier: string;

  @IsString()
  @IsOptional()
  zona: string;
}
