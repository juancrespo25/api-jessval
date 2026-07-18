import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrdenNumberDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  numero: number;
}
