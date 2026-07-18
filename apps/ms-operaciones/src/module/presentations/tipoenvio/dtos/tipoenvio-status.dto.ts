import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class TipoEnvioStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsNumber()
  linea: number;
}
