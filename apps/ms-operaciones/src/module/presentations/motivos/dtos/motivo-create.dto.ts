import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MotivoCreateDto {

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  tipo: number;

}