import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const toInteger = ({ value }: { value: unknown }) =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

export class OrdenGuiasImpresionDTO {
  @Transform(toInteger)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  numero: number;

  @Transform(toInteger)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  itemDesde?: number;

  @Transform(toInteger)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  itemHasta?: number;
}
