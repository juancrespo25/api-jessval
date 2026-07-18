import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LineaCreateDto {

  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  descripcion: string;
}
