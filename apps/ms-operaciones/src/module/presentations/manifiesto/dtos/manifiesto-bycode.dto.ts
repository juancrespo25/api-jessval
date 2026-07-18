import { IsNotEmpty, IsString,  MaxLength } from 'class-validator';

export class ManifiestoByCodeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  codigo: string;
}
