import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GuiaDetalleDTO {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  id_guia: number;
}
