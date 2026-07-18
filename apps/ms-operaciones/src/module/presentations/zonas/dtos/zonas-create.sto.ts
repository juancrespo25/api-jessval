import { IsNotEmpty, IsString } from "class-validator";

export class ZonasCreateDto {

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}