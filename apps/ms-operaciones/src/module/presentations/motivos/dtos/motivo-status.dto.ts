import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class MotivoStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsNumber()
  tipo: number;
}
