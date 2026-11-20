import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class OrdenCodeDTO {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  numero: number;
}
