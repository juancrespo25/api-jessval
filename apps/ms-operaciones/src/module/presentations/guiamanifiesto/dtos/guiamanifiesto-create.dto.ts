import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class GuiaManifiestoCreateDto {

  @IsNotEmpty()
  @IsNumber()
  id_guia: number;

  @IsNotEmpty()
  @IsNumber()
  ordenamiento: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

}