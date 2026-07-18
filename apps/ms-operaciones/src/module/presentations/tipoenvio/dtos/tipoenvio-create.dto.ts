import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TipoEnvioCreateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  descripcion: string;

  @IsNotEmpty()
  @IsInt()
  linea: number;
}
