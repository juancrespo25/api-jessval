import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GuiaSearchByIdDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    id_guia: number;
}