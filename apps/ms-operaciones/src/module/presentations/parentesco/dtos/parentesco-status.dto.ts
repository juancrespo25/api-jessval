import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class ParentescoStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
