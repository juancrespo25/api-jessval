import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GuiaManifiestoValidateDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_guia: number;
}
