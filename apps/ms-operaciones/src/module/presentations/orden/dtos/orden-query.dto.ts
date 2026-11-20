import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { FiltrosQueryOrden } from '../../../ports/orden';

export class OrdenQueryDTO implements FiltrosQueryOrden {
  @IsDateString({ strict: true })
  @Matches(/^(?!0000)\d{4}-\d{2}-\d{2}$/)
  fecha_inicial: string;

  @IsDateString({ strict: true })
  @Matches(/^(?!0000)\d{4}-\d{2}-\d{2}$/)
  fecha_final: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  numero?: number;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(2)
  estado?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(3)
  destino?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(3)
  origen?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(10)
  customer?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(10)
  ccosto?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(200)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(50)
  numero_documento?: string;
}
